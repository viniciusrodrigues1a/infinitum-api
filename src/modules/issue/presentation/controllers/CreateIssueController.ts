import { CreateIssueUseCase } from "@modules/issue/use-cases/CreateIssueUseCase";
import { CreateIssueUseCaseDTO } from "@modules/issue/use-cases/DTOs";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
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
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";

export type CreateIssueControllerRequest = Omit<
  CreateIssueUseCaseDTO,
  "expiresAt"
> & {
  expiresAt?: string;
};

export class CreateIssueController implements IController {
  constructor(
    private readonly createIssueUseCase: CreateIssueUseCase,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: CreateIssueControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      const id = await this.createIssueUseCase.create({
        ...request,
        expiresAt: request.expiresAt ? new Date(request.expiresAt) : undefined,
      });

      return createdResponse({ id });
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        return notFoundResponse(err);
      }

      if (
        err instanceof NotParticipantInProjectError ||
        err instanceof ProjectHasntBegunError ||
        err instanceof ProjectIsArchivedError
      ) {
        return badRequestResponse(err);
      }

      if (err instanceof RoleInsufficientPermissionError) {
        return unauthorizedResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
