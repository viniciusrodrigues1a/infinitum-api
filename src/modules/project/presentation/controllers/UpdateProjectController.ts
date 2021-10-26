import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import { UpdateProjectUseCase } from "@modules/project/use-cases";
import { UpdateProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
import { NotFutureDateError } from "@shared/entities/errors";
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
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";

export type UpdateProjectControllerRequest = Omit<
  UpdateProjectUseCaseDTO,
  "beginsAt" | "finishesAt"
> & {
  beginsAt?: string;
  finishesAt?: string;
};

export class UpdateProjectController implements IController {
  constructor(
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: UpdateProjectControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.updateProjectUseCase.updateProject({
        ...request,
        beginsAt: request.beginsAt ? new Date(request.beginsAt) : undefined,
        finishesAt: request.finishesAt
          ? new Date(request.finishesAt)
          : undefined,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) return notFoundResponse(err);
      if (
        err instanceof NotFutureDateError ||
        err instanceof BeginsAtMustBeBeforeFinishesAtError
      )
        return badRequestResponse(err);
      if (
        err instanceof RoleInsufficientPermissionError ||
        err instanceof NotParticipantInProjectError
      )
        return unauthorizedResponse(err);

      return serverErrorResponse(err);
    }
  }
}
