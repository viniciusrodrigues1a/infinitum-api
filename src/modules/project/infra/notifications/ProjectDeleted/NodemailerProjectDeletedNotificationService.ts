import { IProjectDeletedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { ProjectDeletedTemplate } from "@modules/project/presentation/templates";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendProjectDeletedEmailJob } from "../../jobs";

type Payload = {
  projectName: string;
  emails: string[];
  projectDeletedTemplateLanguage: IProjectDeletedTemplateLanguage;
};

export class NodemailerProjectDeletedNotificationService
  implements INotificationService
{
  constructor(
    private readonly queue: IQueue,
    private readonly shouldAccountReceiveNotification: IShouldAccountReceiveNotificationRepository
  ) {}

  async notify(_: string, payload: Payload): Promise<void> {
    payload.emails.forEach(async (e) => {
      const shouldNotify =
        await this.shouldAccountReceiveNotification.shouldAccountReceiveNotification(
          e,
          "projectDeleted",
          "email"
        );
      if (!shouldNotify) return;

      const { projectName, projectDeletedTemplateLanguage: lang } = payload;

      const html = new ProjectDeletedTemplate().parseTemplate({
        projectDeletedText: lang.getProjectDeletedText(projectName),
      });

      this.queue.add(new SendProjectDeletedEmailJob().key, {
        subject: lang.getProjectDeletedEmailSubject(),
        email: e,
        html,
      });
    });
  }
}
