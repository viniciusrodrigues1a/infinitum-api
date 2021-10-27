import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import { DeleteIssueUseCaseDTO } from "@modules/issue/use-cases/DTOs";
import { IssueNotFoundError } from "@modules/issue/use-cases/errors";
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

export class DeleteIssueController implements IController {
  constructor(private readonly deleteIssueUseCase: DeleteIssueUseCase) {}

  async handleRequest(request: DeleteIssueUseCaseDTO): Promise<HttpResponse> {
    try {
      await this.deleteIssueUseCase.delete(request);

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof IssueNotFoundError ||
        err instanceof ProjectNotFoundError
      ) {
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
