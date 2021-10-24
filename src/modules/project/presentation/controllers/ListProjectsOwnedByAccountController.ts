import { ListProjectsOwnedByAccountUseCase } from "@modules/project/use-cases/ListProjectsOwnedByAccountUseCase";
import {
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export class ListProjectsOwnedByAccountController implements IController {
  constructor(
    private readonly listProjectsOwnedByAccountUseCase: ListProjectsOwnedByAccountUseCase
  ) {}

  async handleRequest({
    accountEmailMakingRequest: email,
  }: AccountMakingRequestDTO): Promise<HttpResponse> {
    try {
      const projects = await this.listProjectsOwnedByAccountUseCase.list(email);

      return okResponse(projects);
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
