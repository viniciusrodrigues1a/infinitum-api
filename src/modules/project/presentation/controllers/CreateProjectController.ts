import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
} from "@modules/project/use-cases";
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
import {
  ICompletedIssueGroupTitleLanguage,
  IInProgressIssueGroupTitleLanguage,
  ITodoIssueGroupTitleLanguage,
} from "../interfaces/languages";
import { IUpdateIssueGroupColorRepository } from "../interfaces/repositories";

export type CreateProjectControllerRequest = Omit<
  CreateProjectDTO,
  "issues" | "participants" | "beginsAt" | "finishesAt" | "projectId"
> & {
  beginsAt?: string;
  finishesAt?: string;
};

export type CreateProjectControllerLanguage = ITodoIssueGroupTitleLanguage &
  IInProgressIssueGroupTitleLanguage &
  ICompletedIssueGroupTitleLanguage;

export class CreateProjectController implements IController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly createIssueGroupForProjectUseCase: CreateIssueGroupForProjectUseCase,
    private readonly updateIssueGroupColorRepository: IUpdateIssueGroupColorRepository,
    private readonly validation: IValidation,
    private readonly language: CreateProjectControllerLanguage
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

      const todoIssueGroupId =
        await this.createIssueGroupForProjectUseCase.create({
          projectId: id,
          title: this.language.getTodoIssueGroupTitle(),
          accountEmailMakingRequest: request.accountEmailMakingRequest,
        });
      await this.updateIssueGroupColorRepository.updateIssueGroupColor({
        issueGroupId: todoIssueGroupId,
        newColor: "ffc824",
      });

      const inProgressIssueGroupId =
        await this.createIssueGroupForProjectUseCase.create({
          projectId: id,
          title: this.language.getInProgressIssueGroupTitle(),
          accountEmailMakingRequest: request.accountEmailMakingRequest,
        });
      await this.updateIssueGroupColorRepository.updateIssueGroupColor({
        issueGroupId: inProgressIssueGroupId,
        newColor: "4ac6ff",
      });

      const completedIssueGroupId =
        await this.createIssueGroupForProjectUseCase.create({
          projectId: id,
          title: this.language.getCompletedIssueGroupTitle(),
          accountEmailMakingRequest: request.accountEmailMakingRequest,
        });
      await this.updateIssueGroupColorRepository.updateIssueGroupColor({
        issueGroupId: completedIssueGroupId,
        newColor: "6bff5b",
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
