import { InvalidEmailError } from "@modules/account/entities/errors";
import { CreateAccountUseCase } from "@modules/account/use-cases";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";

export type CreateAccountControllerRequest = {
  name: string;
  email: string;
};

export class CreateAccountController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  async handleRequest({
    name,
    email,
  }: CreateAccountControllerRequest): Promise<HttpResponse> {
    try {
      await this.createAccountUseCase.create({ name, email });

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof EmailAlreadyInUseError ||
        err instanceof InvalidEmailError
      ) {
        return badRequestResponse(err);
      }

      return serverErrorResponse();
    }
  }
}
