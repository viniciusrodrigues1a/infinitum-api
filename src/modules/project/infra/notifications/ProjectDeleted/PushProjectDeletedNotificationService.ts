import {
  ICreateNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  IShouldAccountReceiveNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { Notification } from "@shared/infra/mongodb/models";
import { IProjectDeletedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";

type Payload = {
  projectName: string;
  emails: string[];
  projectDeletedTemplateLanguage: IProjectDeletedTemplateLanguage;
};

export class PushProjectDeletedNotificationService
  implements INotificationService
{
  constructor(
    private readonly shouldAccountReceiveNotification: IShouldAccountReceiveNotificationRepository,
    private readonly findOneAccountIdByEmailRepository: IFindOneAccountIdByEmailRepository,
    private readonly createNotificationRepository: ICreateNotificationRepository,
    private readonly socketServerEmitter: ISocketServerEmitter
  ) {}

  async notify(_: string, payload: Payload): Promise<void> {
    payload.emails.forEach(async (e) => {
      const shouldNotify =
        await this.shouldAccountReceiveNotification.shouldAccountReceiveNotification(
          e,
          "projectDeleted",
          "push"
        );
      if (!shouldNotify) return;

      const accountId =
        await this.findOneAccountIdByEmailRepository.findOneAccountIdByEmail(e);
      if (!accountId) return;

      const { projectName, projectDeletedTemplateLanguage: lang } = payload;
      const notification: Omit<Notification, "user_id"> = {
        message: lang.getProjectDeletedText(projectName),
        type: "PROJECT_DELETED",
        metadata: {},
        createdAt: new Date().getTime(),
      };

      const id = await this.createNotificationRepository.createNotification({
        user_id: accountId,
        ...notification,
      });

      this.socketServerEmitter.emitToUser(e, "newNotification", {
        _id: id,
        ...notification,
      });
    });
  }
}
