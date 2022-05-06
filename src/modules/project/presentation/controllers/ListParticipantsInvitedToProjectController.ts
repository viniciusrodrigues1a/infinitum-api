import { ListParticipantsInvitedToProjectUseCase } from "@modules/project/use-cases";
import {
  okResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import {
  ProjectNotFoundError,
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";

export type ListParticipantsInvitedToProjectControllerRequest =
  AccountMakingRequestDTO & {
    projectId: string;
  };

export class ListParticipantsInvitedToProjectController implements IController {
  constructor(
    private readonly listParticipantsInvitedToProjectUseCase: ListParticipantsInvitedToProjectUseCase
  ) {}

  async handleRequest(
    request: ListParticipantsInvitedToProjectControllerRequest
  ): Promise<HttpResponse> {
    try {
      const participants =
        await this.listParticipantsInvitedToProjectUseCase.listParticipants(
          request
        );

      return okResponse(participants);
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
