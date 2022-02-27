import { IInvitationTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import {
  ICreateNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  IShouldAccountReceiveNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";

type Payload = {
  token: string;
  projectId: string;
  invitationTemplateLanguage: IInvitationTemplateLanguage;
};

export class PushInvitationToProjectNotificationService
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
        "invitation",
        "push"
      );
    if (!shouldNotify) return;

    const { token, projectId, invitationTemplateLanguage: lang } = payload;

    const accountId =
      await this.findOneAccountIdByEmailRepository.findOneAccountIdByEmail(
        email
      );
    if (!accountId) return;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const type = "INVITATION";
    const message = lang.getInvitationText(projectName);
    const metadata = {
      acceptInvitationLink: `http://localhost:3000/invitation/${token}`,
      declineInvitationLink: `http://localhost:3000/revoke/${token}`,
    };

    await this.createNotificationRepository.createNotification({
      user_id: accountId,
      message,
      type,
      metadata,
    });

    this.socketServerEmitter.emitToUser(email, "newNotification", {
      message,
      type,
      metadata,
    });
  }
}
