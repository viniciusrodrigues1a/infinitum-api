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
import { IRoleUpdatedTemplateLanguage } from "../interfaces/languages";

export class UpdateParticipantRoleInProjectController implements IController {
  constructor(
    private readonly updateParticipantRoleInProjectUseCase: UpdateParticipantRoleInProjectUseCase,
    private readonly validation: IValidation,
    private readonly notificationService: INotificationService,
    private readonly roleUpdatedTemplateLanguage: IRoleUpdatedTemplateLanguage
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

      await this.notificationService.notify(request.accountEmail, {
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
