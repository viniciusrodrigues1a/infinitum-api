import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";

type FindOneAccountControllerRequest = {
  email: string;
};

export class FindOneAccountController implements IController {
  constructor(private readonly findOneAccountUseCase: FindOneAccountUseCase) {}

  async handleRequest({
    email,
  }: FindOneAccountControllerRequest): Promise<HttpResponse> {
    try {
      const account = await this.findOneAccountUseCase.findOne(email);

      return okResponse({ name: account.name, email: account.email });
    } catch (err) {
      if (err instanceof AccountNotFoundError) return notFoundResponse(err);

      return serverErrorResponse(err);
    }
  }
}
