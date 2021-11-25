import { MoveIssueToAnotherIssueGroupUseCase } from "@modules/issue/use-cases";
import { MoveIssueToAnotherIssueGroupUseCaseDTO } from "@modules/issue/use-cases/DTOs";
import {
  IssueGroupBelongsToDifferentProjectError,
  IssueGroupNotFoundError,
  IssueNotFoundError,
} from "@modules/issue/use-cases/errors";
import {
  badRequestResponse,
  noContentResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IValidation } from "@shared/presentation/validation";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors";

export type MoveIssueToAnotherIssueGroupControllerRequest =
  MoveIssueToAnotherIssueGroupUseCaseDTO;

export class MoveIssueToAnotherIssueGroupController implements IController {
  constructor(
    private readonly moveIssueToAnotherIssueGroupUseCase: MoveIssueToAnotherIssueGroupUseCase,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: MoveIssueToAnotherIssueGroupControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.moveIssueToAnotherIssueGroupUseCase.moveIssue(request);

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof IssueNotFoundError ||
        err instanceof IssueGroupNotFoundError
      ) {
        return notFoundResponse(err);
      }

      if (err instanceof IssueGroupBelongsToDifferentProjectError) {
        return badRequestResponse(err);
      }

      if (err instanceof RoleInsufficientPermissionError) {
        return unauthorizedResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
