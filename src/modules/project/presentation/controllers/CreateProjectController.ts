import { CreateProjectUseCase } from "@modules/project/use-cases";
import { CreateProjectDTO } from "@modules/project/use-cases/DTOs";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";

type CreateProjectControllerRequest = Omit<
  CreateProjectDTO,
  "issues" | "participants"
>;

export class CreateProjectController {
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  async handleRequest({
    name,
    description,
    beginsAt,
    finishesAt,
    accountEmailRequestingCreation,
  }: CreateProjectControllerRequest): Promise<HttpResponse> {
    try {
      await this.createProjectUseCase.create({
        name,
        description,
        beginsAt,
        finishesAt,
        accountEmailRequestingCreation,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof AccountNotFoundError) return badRequestResponse(err);

      return serverErrorResponse();
    }
  }
}
