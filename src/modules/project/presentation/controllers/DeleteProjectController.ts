import { DeleteProjectUseCase } from "@modules/project/use-cases";
import { DeleteProjectDTO } from "@modules/project/use-cases/DTOs/DeleteProjectDTO";
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

export class DeleteProjectController implements IController {
  constructor(private readonly deleteProjectUseCase: DeleteProjectUseCase) {}

  async handleRequest({
    projectId,
    accountEmailMakingRequest,
  }: DeleteProjectDTO): Promise<HttpResponse> {
    try {
      await this.deleteProjectUseCase.delete({
        projectId,
        accountEmailMakingRequest,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) return notFoundResponse(err);
      if (err instanceof NotParticipantInProjectError)
        return badRequestResponse(err);
      if (err instanceof RoleInsufficientPermissionError)
        return unauthorizedResponse(err);

      return serverErrorResponse(err);
    }
  }
}
