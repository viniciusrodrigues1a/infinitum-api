import { IRoleUpdatedAdminTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import {
  ICreateNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  IShouldAccountReceiveNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { Notification } from "@shared/infra/mongodb/models";

type Payload = {
  projectId: string;
  emailWhoseRoleHasBeenUpdated: string;
  roleName: string;
  roleUpdatedAdminTemplateLanguage: IRoleUpdatedAdminTemplateLanguage;
};

export class PushRoleUpdatedAdminNotificationService
  implements INotificationService
{
  constructor(
    private readonly shouldAccountReceiveNotification: IShouldAccountReceiveNotificationRepository,
    private readonly findOneAccountIdByEmailRepository: IFindOneAccountIdByEmailRepository,
    private readonly findProjectNameByProjectIdRepository: IFindProjectNameByProjectIdRepository,
    private readonly createNotificationRepository: ICreateNotificationRepository,
    private readonly socketServerEmitter: ISocketServerEmitter
  ) {}

  async notify(email: string, payload: Payload): Promise<void> {
    const shouldNotify =
      await this.shouldAccountReceiveNotification.shouldAccountReceiveNotification(
        email,
        "roleUpdatedAdmin",
        "push"
      );
    if (!shouldNotify) return;

    const {
      emailWhoseRoleHasBeenUpdated,
      projectId,
      roleName,
      roleUpdatedAdminTemplateLanguage: lang,
    } = payload;

    const accountId =
      await this.findOneAccountIdByEmailRepository.findOneAccountIdByEmail(
        email
      );
    if (!accountId) return;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const notification: Omit<Notification, "user_id"> = {
      message: lang.getRoleUpdatedAdminText(
        emailWhoseRoleHasBeenUpdated,
        projectName,
        roleName
      ),
      type: "ROLE_UPDATED_ADMIN",
      metadata: {},
      createdAt: new Date().getTime(),
    };

    const id = await this.createNotificationRepository.createNotification({
      user_id: accountId,
      ...notification,
    });

    this.socketServerEmitter.emitToUser(email, "newNotification", {
      _id: id,
      ...notification,
    });
  }
}
