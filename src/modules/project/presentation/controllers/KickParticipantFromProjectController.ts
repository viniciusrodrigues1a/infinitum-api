import { KickParticipantFromProjectUseCase } from "@modules/project/use-cases";
import { KickParticipantFromProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
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

export class KickParticipantFromProjectController implements IController {
  constructor(
    private readonly kickParticipantFromProjectUseCase: KickParticipantFromProjectUseCase
  ) {}

  async handleRequest(
    request: KickParticipantFromProjectUseCaseDTO
  ): Promise<HttpResponse> {
    try {
      await this.kickParticipantFromProjectUseCase.kick(request);

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
