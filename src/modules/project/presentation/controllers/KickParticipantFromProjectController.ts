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
import { IKickedTemplateLanguage } from "../interfaces/languages";

export class KickParticipantFromProjectController implements IController {
  constructor(
    private readonly kickParticipantFromProjectUseCase: KickParticipantFromProjectUseCase,
    private readonly validation: IValidation,
    private readonly notificationService: INotificationService,
    private readonly kickedTemplateLanguage: IKickedTemplateLanguage
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

      await this.notificationService.notify(request.accountEmail, {
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
