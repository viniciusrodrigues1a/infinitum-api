import { IRoleUpdatedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { RoleUpdatedTemplate } from "@modules/project/presentation/templates";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { SendRoleUpdatedEmailJob } from "../../jobs";

type Payload = {
  projectId: string;
  roleName: string;
  roleUpdatedTemplateLanguage: IRoleUpdatedTemplateLanguage;
};

export class NodemailerRoleUpdatedNotificationService
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
        "roleUpdated",
        "email"
      );
    if (!shouldNotify) return;

    const { projectId, roleName, roleUpdatedTemplateLanguage: lang } = payload;

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    const html = new RoleUpdatedTemplate().parseTemplate({
      roleUpdatedText: lang.getRoleUpdatedText(projectName, roleName),
    });

    this.queue.add(new SendRoleUpdatedEmailJob().key, {
      subject: lang.getRoleUpdatedEmailSubject(),
      email,
      html,
    });
  }
}
