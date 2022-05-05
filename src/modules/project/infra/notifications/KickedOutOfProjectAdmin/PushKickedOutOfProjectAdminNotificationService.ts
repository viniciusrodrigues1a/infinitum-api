import { IKickedAdminTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { Notification } from "@shared/infra/mongodb/models";
import {
  IShouldAccountReceiveNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  ICreateNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";

type Payload = {
  projectId: string;
  emailKicked: string;
  kickedAdminTemplateLanguage: IKickedAdminTemplateLanguage;
};

export class PushKickedOutOfProjectAdminNotificationService
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
        "kicked",
        "push"
      );
    if (!shouldNotify) return;

    const {
      projectId,
      emailKicked,
      kickedAdminTemplateLanguage: lang,
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

    const type = "KICKED_ADMIN";
    const message = lang.getKickedAdminText(emailKicked, projectName);

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
