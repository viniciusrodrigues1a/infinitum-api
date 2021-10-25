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
    private readonly createIssueGroupForProjectUseCase: CreateIssueGroupForProjectUseCase
  ) {}

  async handleRequest({
    title,
    projectId,
    accountEmailMakingRequest,
  }: CreateIssueGroupForProjectControllerRequest): Promise<HttpResponse> {
    try {
      const id = await this.createIssueGroupForProjectUseCase.create({
        title,
        projectId,
        accountEmailMakingRequest,
      });

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
