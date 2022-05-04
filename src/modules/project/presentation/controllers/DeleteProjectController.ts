import { DeleteProjectUseCase } from "@modules/project/use-cases";
import { DeleteProjectDTO } from "@modules/project/use-cases/DTOs/DeleteProjectDTO";
import {
  badRequestResponse,
  noContentResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import { IProjectDeletedTemplateLanguage } from "../interfaces/languages";
import {
  IFindAllEmailsParticipantInProject,
  IFindProjectNameByProjectIdRepository,
} from "../interfaces/repositories";

export class DeleteProjectController implements IController {
  constructor(
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly findProjectNameByProjectIdRepository: IFindProjectNameByProjectIdRepository,
    private readonly findAllEmailsParticipantInProject: IFindAllEmailsParticipantInProject,
    private readonly notificationService: INotificationService,
    private readonly projectDeletedTemplateLanguage: IProjectDeletedTemplateLanguage
  ) {}

  async handleRequest({
    projectId,
    accountEmailMakingRequest,
  }: DeleteProjectDTO): Promise<HttpResponse> {
    try {
      const emails = await this.findAllEmailsParticipantInProject.findAllEmails(
        projectId
      );
      const projectName =
        await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
          projectId
        );

      await this.deleteProjectUseCase.delete({
        projectId,
        accountEmailMakingRequest,
      });

      const emailsWithoutAccountEmailMakingRequest = emails.filter(
        (e) => e !== accountEmailMakingRequest
      );

      await this.notificationService.notify("", {
        emails: emailsWithoutAccountEmailMakingRequest,
        projectName,
        projectDeletedTemplateLanguage: this.projectDeletedTemplateLanguage,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) return notFoundResponse(err);
      if (err instanceof NotParticipantInProjectError)
        return badRequestResponse(err);
      if (err instanceof RoleInsufficientPermissionError)
        return unauthorizedResponse(err);

      return serverErrorResponse(err);
    }
  }
}
