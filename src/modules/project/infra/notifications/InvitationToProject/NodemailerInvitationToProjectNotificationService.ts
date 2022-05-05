import { IInvitationTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { InvitationTemplate } from "@modules/project/presentation/templates";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendInvitationEmailJob } from "@modules/project/infra/jobs";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";

type Payload = {
  token: string;
  projectId: string;
  invitationTemplateLanguage: IInvitationTemplateLanguage;
};

export class NodemailerInvitationToProjectNotificationService
  implements INotificationService
{
  constructor(
    private readonly queue: IQueue,
    private readonly shouldAccountReceiveNotification: IShouldAccountReceiveNotificationRepository,
    private readonly findProjectNameByProjectIdRepository: IFindProjectNameByProjectIdRepository
  ) {}

  async notify(email: string, payload: Payload): Promise<void> {
    const shouldNotify =
      await this.shouldAccountReceiveNotification.shouldAccountReceiveNotification(
        email,
        "invitation",
        "email"
      );
    if (!shouldNotify) return;

    const { token, projectId, invitationTemplateLanguage: lang } = payload;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const html = new InvitationTemplate().parseTemplate({
      token,
      projectId,
      invitationText: lang.getInvitationText(projectName),
      acceptInvitationButtonText: lang.getAcceptInvitationButtonText(),
      declineInvitationButtonText: lang.getDeclineInvitationButtonText(),
    });

    this.queue.add(new SendInvitationEmailJob().key, {
      subject: lang.getInvitationEmailSubject(),
      email,
      html,
    });
  }
}
