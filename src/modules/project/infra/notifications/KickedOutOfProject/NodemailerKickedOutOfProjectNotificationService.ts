import { IKickedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { KickedTemplate } from "@modules/project/presentation/templates";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendKickedEmailJob } from "../../jobs";

type Payload = {
  projectId: string;
  kickedTemplateLanguage: IKickedTemplateLanguage;
};

export class NodemailerKickedOutOfProjectNotificationService
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

    const { projectId, kickedTemplateLanguage: lang } = payload;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const html = new KickedTemplate().parseTemplate({
      kickedText: lang.getKickedText(projectName),
    });

    this.queue.add(new SendKickedEmailJob().key, {
      subject: lang.getKickedEmailSubject(),
      email,
      html,
    });
  }
}
