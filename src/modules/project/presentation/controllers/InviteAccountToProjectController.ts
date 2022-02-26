import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { OwnerCantBeUsedAsARoleForAnInvitationError } from "@modules/project/entities/errors/OwnerCantBeUsedAsARoleForAnInvitationError";
import { InviteAccountToProjectUseCase } from "@modules/project/use-cases";
import { InviteAccountToProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
import {
  AccountAlreadyParticipatesInProjectError,
  AccountHasAlreadyBeenInvitedError,
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
import { IInvitationTemplateLanguage } from "../interfaces/languages";

export type InviteAccountToProjectControllerRequest =
  InviteAccountToProjectUseCaseDTO;

export class InviteAccountToProjectController implements IController {
  constructor(
    private readonly inviteAccountToProjectUseCase: InviteAccountToProjectUseCase,
    private readonly validation: IValidation,
    private readonly notificationService: INotificationService,
    private readonly invitationTemplateLanguage: IInvitationTemplateLanguage
  ) {}

  async handleRequest(
    request: InviteAccountToProjectControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      const token = await this.inviteAccountToProjectUseCase.invite(request);

      await this.notificationService.notify(request.accountEmail, {
        token,
        projectId: request.projectId,
        invitationTemplateLanguage: this.invitationTemplateLanguage,
      });

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof NotParticipantInProjectError ||
        err instanceof AccountAlreadyParticipatesInProjectError ||
        err instanceof AccountHasAlreadyBeenInvitedError ||
        err instanceof OwnerCantBeUsedAsARoleForAnInvitationError
      ) {
        return badRequestResponse(err);
      }

      if (
        err instanceof ProjectNotFoundError ||
        err instanceof AccountNotFoundError
      ) {
        return notFoundResponse(err);
      }

      if (err instanceof RoleInsufficientPermissionError) {
        return unauthorizedResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
