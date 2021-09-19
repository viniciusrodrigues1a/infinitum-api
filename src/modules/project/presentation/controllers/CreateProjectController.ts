import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { CreateProjectUseCase } from "@modules/project/use-cases";
import { CreateProjectDTO } from "@modules/project/use-cases/DTOs";
import { MissingParamsError } from "@shared/presentation/errors";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IMissingParamsErrorLanguage } from "@shared/presentation/interfaces/languages";
import { ICreateProjectControllerLanguage } from "./interfaces/languages";

export type CreateProjectControllerRequest = Omit<
  CreateProjectDTO,
  "issues" | "participants"
>;

export class CreateProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly createProjectControllerLanguage: ICreateProjectControllerLanguage,
    private readonly missingParamsErrorLanguage: IMissingParamsErrorLanguage
  ) {}

  async handleRequest({
    name,
    description,
    beginsAt,
    finishesAt,
    accountEmailRequestingCreation,
  }: CreateProjectControllerRequest): Promise<HttpResponse> {
    if (!name)
      return badRequestResponse(
        new MissingParamsError(
          [
            this.createProjectControllerLanguage.getMissingParamsErrorNameParamMessage(),
          ],
          this.missingParamsErrorLanguage
        )
      );

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
