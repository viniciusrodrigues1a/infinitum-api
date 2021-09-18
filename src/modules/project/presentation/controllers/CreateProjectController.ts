import { CreateProjectUseCase } from "@modules/project/use-cases";
import { CreateProjectDTO } from "@modules/project/use-cases/DTOs";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import {
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";

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
      return serverErrorResponse();
    }
  }
}
