import { DeleteProjectUseCase } from "@modules/project/use-cases";
import { DeleteProjectDTO } from "@modules/project/use-cases/DTOs/DeleteProjectDTO";
import { IFindAccountLanguageIsoCodeRepository } from "@shared/infra/notifications/interfaces";
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
import {
  IFindAllEmailsParticipantInProject,
  IFindProjectNameByProjectIdRepository,
} from "../interfaces/repositories";

type DeleteProjectControllerRequest = DeleteProjectDTO & {
  languages: any;
};

export class DeleteProjectController implements IController {
  constructor(
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly findProjectNameByProjectIdRepository: IFindProjectNameByProjectIdRepository,
    private readonly findAllEmailsParticipantInProject: IFindAllEmailsParticipantInProject,
    private readonly notificationService: INotificationService,
    private readonly findAccountIsoCodeRepository: IFindAccountLanguageIsoCodeRepository
  ) {}

  async handleRequest({
    projectId,
    accountEmailMakingRequest,
    languages,
  }: DeleteProjectControllerRequest): Promise<HttpResponse> {
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

      emailsWithoutAccountEmailMakingRequest.forEach(async (e: string) => {
        const isoCode = await this.findAccountIsoCodeRepository.findIsoCode(e);
        const lang = languages[isoCode];
        await this.notificationService.notify(e, {
          projectName,
          projectDeletedTemplateLanguage: lang,
        });
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
