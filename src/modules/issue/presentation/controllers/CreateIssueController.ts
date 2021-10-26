import { CreateIssueUseCase } from "@modules/issue/use-cases/CreateIssueUseCase";
import { CreateIssueUseCaseDTO } from "@modules/issue/use-cases/DTOs";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
import { NotFutureDateError } from "@shared/entities/errors";
import {
  badRequestResponse,
  createdResponse,
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

export type CreateIssueControllerRequest = Omit<
  CreateIssueUseCaseDTO,
  "expiresAt"
> & {
  expiresAt?: string;
};

export class CreateIssueController implements IController {
  constructor(private readonly createIssueUseCase: CreateIssueUseCase) {}

  async handleRequest({
    projectId,
    title,
    description,
    expiresAt,
    accountEmailMakingRequest,
  }: CreateIssueControllerRequest): Promise<HttpResponse> {
    try {
      const id = await this.createIssueUseCase.create({
        projectId,
        title,
        description,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        accountEmailMakingRequest,
      });

      return createdResponse({ id });
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        return notFoundResponse(err);
      }

      if (
        err instanceof NotParticipantInProjectError ||
        err instanceof ProjectHasntBegunError ||
        err instanceof ProjectIsArchivedError ||
        err instanceof NotFutureDateError
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
