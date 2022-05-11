import { IssueGroupNotFoundError } from "@modules/issue/use-cases/errors";
import { DeleteIssueGroupUseCase } from "@modules/project/use-cases";
import {
  noContentResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import {
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";

export type DeleteIssueGroupControllerRequest = AccountMakingRequestDTO & {
  issueGroupId: string;
};

export class DeleteIssueGroupController implements IController {
  constructor(
    private readonly deleteIssueGroupUseCase: DeleteIssueGroupUseCase
  ) {}

  async handleRequest(
    request: DeleteIssueGroupControllerRequest
  ): Promise<HttpResponse> {
    try {
      await this.deleteIssueGroupUseCase.deleteIssueGroup(request);

      return noContentResponse();
    } catch (err) {
      if (err instanceof IssueGroupNotFoundError) return notFoundResponse(err);

      if (err instanceof NotParticipantInProjectError)
        return badRequestResponse(err);

      if (err instanceof RoleInsufficientPermissionError)
        return unauthorizedResponse(err);

      return serverErrorResponse(err);
    }
  }
}
