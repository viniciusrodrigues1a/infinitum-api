import { AcceptInvitationToProjectUseCase } from "@modules/project/use-cases/AcceptInvitationToProjectUseCase";
import { InvalidInvitationTokenError } from "@modules/project/use-cases/errors/InvalidInvitationTokenError";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type AcceptInvitationToProjectControllerRequest =
  AccountMakingRequestDTO & {
    invitationToken: string;
  };

export class AcceptInvitationToProjectController implements IController {
  constructor(
    private readonly acceptInvitationToProjectUseCase: AcceptInvitationToProjectUseCase
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
    invitationToken,
  }: AcceptInvitationToProjectControllerRequest): Promise<HttpResponse> {
    try {
      await this.acceptInvitationToProjectUseCase.accept({
        token: invitationToken,
        accountEmailMakingRequest,
      });
      return noContentResponse();
    } catch (err) {
      if (err instanceof InvalidInvitationTokenError) {
        return badRequestResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
