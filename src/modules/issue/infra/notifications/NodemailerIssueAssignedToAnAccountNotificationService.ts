import { IssueAssignedTemplate } from "@modules/issue/presentation/templates";
import { IIssueAssignedToAnAccountTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectIdByIssueIdRepository } from "@modules/project/use-cases/interfaces/repositories";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendIssueAssignedEmailJob } from "../jobs";
import { IFindIssueTitleByIssueIdRepository } from "./interfaces/repositories";

type Payload = {
  issueId: string;
  issueAssignedTemplateLanguage: IIssueAssignedToAnAccountTemplateLanguage;
};

export class NodemailerIssueAssignedNotificationService
  implements INotificationService
{
  constructor(
    private readonly queue: IQueue,
    private readonly shouldAccountReceiveNotification: IShouldAccountReceiveNotificationRepository,
    private readonly findProjectIdByIssueIdRepository: IFindProjectIdByIssueIdRepository,
    private readonly findIssueTitleByIssueIdRepository: IFindIssueTitleByIssueIdRepository
  ) {}

  async notify(email: string, payload: Payload): Promise<void> {
    const shouldNotify =
      await this.shouldAccountReceiveNotification.shouldAccountReceiveNotification(
        email,
        "issueAssigned",
        "email"
      );
    if (!shouldNotify) return;

    const { issueId, issueAssignedTemplateLanguage: lang } = payload;

    const projectId =
      await this.findProjectIdByIssueIdRepository.findProjectIdByIssueId(
        issueId
      );
    if (!projectId) return;

    const issueTitle =
      await this.findIssueTitleByIssueIdRepository.findIssueTitle(issueId);

    const html = new IssueAssignedTemplate().parseTemplate({
      projectId,
      issueAssignedText: lang.getIssueAssignedText(issueTitle),
      linkToProjectButtonText: lang.getIssueAssignedLinkToProjectButtonText(),
    });

    this.queue.add(new SendIssueAssignedEmailJob().key, {
      subject: lang.getIssueAssignedEmailSubject(),
      email,
      html,
    });
  }
}
