import { UpdateIssueUseCase } from "@modules/issue/use-cases";
import { UpdateIssueUseCaseDTO } from "@modules/issue/use-cases/DTOs";
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
import { IValidation } from "@shared/presentation/validation";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";

export type UpdateIssueControllerRequest = Omit<
  UpdateIssueUseCaseDTO,
  "newExpiresAt"
> & {
  newExpiresAt?: string | null;
};

export class UpdateIssueController implements IController {
  constructor(
    private readonly updateIssueUseCase: UpdateIssueUseCase,
    private readonly validation: IValidation
  ) {}

  async handleRequest(request: UpdateIssueUseCaseDTO): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.updateIssueUseCase.update({
        ...request,
        newExpiresAt: request.newExpiresAt
          ? new Date(request.newExpiresAt)
          : request.newExpiresAt,
      });

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
