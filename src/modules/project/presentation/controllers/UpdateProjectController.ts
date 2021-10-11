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
  constructor(private readonly updateProjectUseCase: UpdateProjectUseCase) {}

  async handleRequest({
    projectId,
    accountEmailMakingRequest,
    name,
    description,
    beginsAt,
    finishesAt,
  }: UpdateProjectControllerRequest): Promise<HttpResponse> {
    try {
      await this.updateProjectUseCase.updateProject({
        projectId,
        accountEmailMakingRequest,
        name,
        description,
        beginsAt: beginsAt ? new Date(beginsAt) : undefined,
        finishesAt: finishesAt ? new Date(finishesAt) : undefined,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) return notFoundResponse(err);
      if (
        err instanceof NotFutureDateError ||
        err instanceof BeginsAtMustBeBeforeFinishesAtError ||
        err instanceof NotParticipantInProjectError
      )
        return badRequestResponse(err);
      if (err instanceof RoleInsufficientPermissionError)
        return unauthorizedResponse(err);

      return serverErrorResponse(err);
    }
  }
}
