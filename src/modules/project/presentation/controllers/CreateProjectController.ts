import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import { CreateProjectUseCase } from "@modules/project/use-cases";
import { CreateProjectDTO } from "@modules/project/use-cases/DTOs";
import { NotFutureDateError } from "@shared/entities/errors";
import {
  badRequestResponse,
  createdResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IValidation } from "@shared/presentation/validation";

export type CreateProjectControllerRequest = Omit<
  CreateProjectDTO,
  "issues" | "participants" | "beginsAt" | "finishesAt" | "projectId"
> & {
  beginsAt?: string;
  finishesAt?: string;
};

export class CreateProjectController implements IController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: CreateProjectControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      const id = await this.createProjectUseCase.create({
        ...request,
        beginsAt: request.beginsAt ? new Date(request.beginsAt) : undefined,
        finishesAt: request.finishesAt
          ? new Date(request.finishesAt)
          : undefined,
      });

      return createdResponse({ id });
    } catch (err) {
      if (
        err instanceof NotFutureDateError ||
        err instanceof BeginsAtMustBeBeforeFinishesAtError
      )
        return badRequestResponse(err);

      return serverErrorResponse(err);
    }
  }
}
