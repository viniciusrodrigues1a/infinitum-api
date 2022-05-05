import { IKickedAdminTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { KickedAdminTemplate } from "@modules/project/presentation/templates";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendKickedAdminEmailJob } from "../../jobs";

type Payload = {
  projectId: string;
  emailKicked: string;
  kickedAdminTemplateLanguage: IKickedAdminTemplateLanguage;
};

export class NodemailerKickedOutOfProjectAdminNotificationService
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
        "kicked",
        "email"
      );
    if (!shouldNotify) return;

    const {
      projectId,
      emailKicked,
      kickedAdminTemplateLanguage: lang,
    } = payload;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const html = new KickedAdminTemplate().parseTemplate({
      kickedAdminText: lang.getKickedAdminText(emailKicked, projectName),
      linkToProjectButtonText: lang.getKickedAdminLinkToProjectButtonText(),
      projectId,
    });

    this.queue.add(new SendKickedAdminEmailJob().key, {
      subject: lang.getKickedAdminEmailSubject(),
      email,
      html,
    });
  }
}
