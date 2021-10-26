import { CreateIssueGroupForProjectUseCase } from "@modules/project/use-cases/CreateIssueGroupForProjectUseCase";
import { CreateIssueGroupForProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
import {
  badRequestResponse,
  createdResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IValidation } from "@shared/presentation/validation";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";

export type CreateIssueGroupForProjectControllerRequest =
  AccountMakingRequestDTO & CreateIssueGroupForProjectUseCaseDTO;

export class CreateIssueGroupForProjectController implements IController {
  constructor(
    private readonly createIssueGroupForProjectUseCase: CreateIssueGroupForProjectUseCase,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: CreateIssueGroupForProjectControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      const id = await this.createIssueGroupForProjectUseCase.create(request);

      return createdResponse({ id });
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
