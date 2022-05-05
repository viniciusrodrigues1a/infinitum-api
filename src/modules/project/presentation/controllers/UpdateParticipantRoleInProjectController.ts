import { InvalidRoleNameError } from "@modules/project/entities/errors";
import { UpdateParticipantRoleInProjectUseCase } from "@modules/project/use-cases";
import { UpdateParticipantRoleInProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
import {
  CannotUpdateRoleOfOwnerError,
  CannotUpdateRoleToOwnerError,
  CannotUpdateYourOwnRoleError,
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
  IRoleUpdatedAdminTemplateLanguage,
  IRoleUpdatedTemplateLanguage,
} from "../interfaces/languages";
import { IFindAllEmailsOfOwnersAndAdminsOfProjectRepository } from "../interfaces/repositories";

export class UpdateParticipantRoleInProjectController implements IController {
  constructor(
    private readonly updateParticipantRoleInProjectUseCase: UpdateParticipantRoleInProjectUseCase,
    private readonly findAllEmailsOfOwnersAndAdminsOfProjectRepository: IFindAllEmailsOfOwnersAndAdminsOfProjectRepository,
    private readonly validation: IValidation,
    private readonly notifyUserNotificationService: INotificationService,
    private readonly notifyAdminsNotificationService: INotificationService,
    private readonly roleUpdatedTemplateLanguage: IRoleUpdatedTemplateLanguage,
    private readonly roleUpdatedAdminTemplateLanguage: IRoleUpdatedAdminTemplateLanguage
  ) {}

  async handleRequest(
    request: UpdateParticipantRoleInProjectUseCaseDTO
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.updateParticipantRoleInProjectUseCase.updateParticipantRole(
        request
      );

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
          emailWhoseRoleHasBeenUpdated: request.accountEmail,
          projectId: request.projectId,
          roleName: request.roleName,
          roleUpdatedAdminTemplateLanguage:
            this.roleUpdatedAdminTemplateLanguage,
        });
      });

      await this.notifyUserNotificationService.notify(request.accountEmail, {
        projectId: request.projectId,
        roleName: request.roleName,
        roleUpdatedTemplateLanguage: this.roleUpdatedTemplateLanguage,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        return notFoundResponse(err);
      }

      if (
        err instanceof NotParticipantInProjectError ||
        err instanceof CannotUpdateRoleToOwnerError ||
        err instanceof CannotUpdateYourOwnRoleError ||
        err instanceof CannotUpdateRoleOfOwnerError ||
        err instanceof InvalidRoleNameError
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
