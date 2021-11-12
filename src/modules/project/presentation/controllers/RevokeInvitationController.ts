import { RevokeInvitationUseCase } from "@modules/project/use-cases";
import { RevokeInvitationUseCaseDTO } from "@modules/project/use-cases/DTOs";
import {
  badRequestResponse,
  noContentResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";

export class RevokeInvitationController implements IController {
  constructor(
    private readonly revokeInvitationUseCase: RevokeInvitationUseCase
  ) {}

  async handleRequest(
    request: RevokeInvitationUseCaseDTO
  ): Promise<HttpResponse> {
    try {
      await this.revokeInvitationUseCase.revokeInvitation(request);

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        return notFoundResponse(err);
      }

      if (err instanceof NotParticipantInProjectError) {
        return badRequestResponse(err);
      }

      if (err instanceof RoleInsufficientPermissionError) {
        return unauthorizedResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
