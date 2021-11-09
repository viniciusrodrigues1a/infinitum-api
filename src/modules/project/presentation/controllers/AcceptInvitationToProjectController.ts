import { AcceptInvitationToProjectUseCase } from "@modules/project/use-cases/AcceptInvitationToProjectUseCase";
import { InvalidInvitationTokenError } from "@modules/project/use-cases/errors/InvalidInvitationTokenError";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";

export class AcceptInvitationToProjectController implements IController {
  constructor(
    private readonly acceptInvitationToProjectUseCase: AcceptInvitationToProjectUseCase
  ) {}

  async handleRequest(invitationToken: string): Promise<HttpResponse> {
    try {
      await this.acceptInvitationToProjectUseCase.accept(invitationToken);
      return noContentResponse();
    } catch (err) {
      if (err instanceof InvalidInvitationTokenError) {
        return badRequestResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
