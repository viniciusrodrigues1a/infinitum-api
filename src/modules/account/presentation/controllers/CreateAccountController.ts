import { InvalidEmailError } from "@modules/account/entities/errors";
import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
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
  password: string;
};

export class CreateAccountController {
  constructor(
    private readonly registerAccountRepository: IRegisterAccountRepository
  ) {}

  async handleRequest({
    name,
    email,
    password,
  }: CreateAccountControllerRequest): Promise<HttpResponse> {
    try {
      await this.registerAccountRepository.create({ name, email, password });

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
