import { IRoleUpdatedAdminTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { KickedAdminTemplate } from "@modules/project/presentation/templates";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendRoleUpdatedEmailJob } from "../../jobs";

type Payload = {
  projectId: string;
  emailWhoseRoleHasBeenUpdated: string;
  roleName: string;
  roleUpdatedAdminTemplateLanguage: IRoleUpdatedAdminTemplateLanguage;
};

export class NodemailerRoleUpdatedAdminNotificationService
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
        "roleUpdatedAdmin",
        "email"
      );
    if (!shouldNotify) return;

    const {
      emailWhoseRoleHasBeenUpdated,
      projectId,
      roleName,
      roleUpdatedAdminTemplateLanguage: lang,
    } = payload;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const html = new KickedAdminTemplate().parseTemplate({
      kickedAdminText: lang.getRoleUpdatedAdminText(
        emailWhoseRoleHasBeenUpdated,
        projectName,
        roleName
      ),
      linkToProjectButtonText:
        lang.getRoleUpdatedAdminLinkToProjectButtonText(),
      projectId,
    });

    this.queue.add(new SendRoleUpdatedEmailJob().key, {
      subject: lang.getRoleUpdatedAdminEmailSubject(),
      email,
      html,
    });
  }
}
