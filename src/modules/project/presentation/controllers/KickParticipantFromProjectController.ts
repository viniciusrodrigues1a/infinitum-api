import { KickParticipantFromProjectUseCase } from "@modules/project/use-cases";
import { KickParticipantFromProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
import {
  CannotKickOwnerOfProjectError,
  CannotKickYourselfError,
} from "@modules/project/use-cases/errors";
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
import { IValidation } from "@shared/presentation/validation";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  IKickedAdminTemplateLanguage,
  IKickedTemplateLanguage,
} from "../interfaces/languages";
import { IFindAllEmailsOfOwnersAndAdminsOfProjectRepository } from "../interfaces/repositories";

export class KickParticipantFromProjectController implements IController {
  constructor(
    private readonly kickParticipantFromProjectUseCase: KickParticipantFromProjectUseCase,
    private readonly findAllEmailsOfOwnersAndAdminsOfProjectRepository: IFindAllEmailsOfOwnersAndAdminsOfProjectRepository,
    private readonly validation: IValidation,
    private readonly notifyUserNotificationService: INotificationService,
    private readonly notifyAdminsNotificationService: INotificationService,
    private readonly kickedTemplateLanguage: IKickedTemplateLanguage,
    private readonly kickedAdminTemplateLanguage: IKickedAdminTemplateLanguage
  ) {}

  async handleRequest(
    request: KickParticipantFromProjectUseCaseDTO
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.kickParticipantFromProjectUseCase.kick(request);

      const emailsOfOwnersAndAdmins =
        await this.findAllEmailsOfOwnersAndAdminsOfProjectRepository.findAllEmailsOfOwnersAndAdmins(
          request.projectId
        );
      const filteredEmails = emailsOfOwnersAndAdmins.filter(
        (e) =>
          e !== request.accountEmailMakingRequest && e !== request.accountEmail
      );

      filteredEmails.forEach(async (e: string) => {
        await this.notifyAdminsNotificationService.notify(e, {
          projectId: request.projectId,
          emailKicked: request.accountEmail,
          kickedAdminTemplateLanguage: this.kickedAdminTemplateLanguage,
        });
      });

      await this.notifyUserNotificationService.notify(request.accountEmail, {
        projectId: request.projectId,
        kickedTemplateLanguage: this.kickedTemplateLanguage,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        return notFoundResponse(err);
      }

      if (
        err instanceof NotParticipantInProjectError ||
        err instanceof CannotKickOwnerOfProjectError ||
        err instanceof CannotKickYourselfError
      ) {
        return badRequestResponse(err);
      }

      if (err instanceof RoleInsufficientPermissionError) {
        return unauthorizedResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
