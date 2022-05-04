import { IIssueAssignedToAnAccountTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectIdByIssueIdRepository } from "@modules/project/use-cases/interfaces/repositories";
import { Notification } from "@shared/infra/mongodb/models";
import {
  IShouldAccountReceiveNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  ICreateNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { IFindIssueTitleByIssueIdRepository } from "../interfaces/repositories";

type Payload = {
  issueId: string;
  issueAssignedTemplateLanguage: IIssueAssignedToAnAccountTemplateLanguage;
};

export class PushIssueAssignedToAnAccountNotificationService
  implements INotificationService
{
  constructor(
    private readonly shouldAccountReceiveNotification: IShouldAccountReceiveNotificationRepository,
    private readonly findOneAccountIdByEmailRepository: IFindOneAccountIdByEmailRepository,
    private readonly findIssueTitleByIssueIdRepository: IFindIssueTitleByIssueIdRepository,
    private readonly findProjectIdByIssueIdRepository: IFindProjectIdByIssueIdRepository,
    private readonly createNotificationRepository: ICreateNotificationRepository,
    private readonly socketServerEmitter: ISocketServerEmitter
  ) {}

  async notify(email: string, payload: Payload): Promise<void> {
    const shouldNotify =
      await this.shouldAccountReceiveNotification.shouldAccountReceiveNotification(
        email,
        "issueAssigned",
        "push"
      );
    if (!shouldNotify) return;

    const { issueId, issueAssignedTemplateLanguage: lang } = payload;

    const accountId =
      await this.findOneAccountIdByEmailRepository.findOneAccountIdByEmail(
        email
      );
    if (!accountId) return;

    const issueTitle =
      await this.findIssueTitleByIssueIdRepository.findIssueTitle(issueId);
    const projectId =
      await this.findProjectIdByIssueIdRepository.findProjectIdByIssueId(
        issueId
      );

    const type: Notification["type"] = "ISSUE_ASSIGNED";
    const message = lang.getIssueAssignedText(issueTitle);
    const metadata = {
      linkToProject: `/projects/${projectId}`,
    };

    const createdAt = new Date().getTime();
    const notification = {
      message,
      type,
      metadata,
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
