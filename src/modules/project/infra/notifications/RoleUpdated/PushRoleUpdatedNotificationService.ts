import { IRoleUpdatedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
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
  roleName: string;
  roleUpdatedTemplateLanguage: IRoleUpdatedTemplateLanguage;
};

export class PushRoleUpdatedNotificationService
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
        "roleUpdated",
        "push"
      );
    if (!shouldNotify) return;

    const { projectId, roleName, roleUpdatedTemplateLanguage: lang } = payload;

    const accountId =
      await this.findOneAccountIdByEmailRepository.findOneAccountIdByEmail(
        email
      );
    if (!accountId) return;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const type = "ROLE_UPDATED";
    const message = lang.getRoleUpdatedText(projectName, roleName);

    const createdAt = new Date().getTime();
    const notification = {
      message,
      type: type as Notification["type"],
      metadata: {},
      createdAt,
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
