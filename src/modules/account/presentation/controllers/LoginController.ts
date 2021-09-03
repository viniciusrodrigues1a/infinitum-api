import { ILoginRepository } from "@modules/account/infra/repositories";
import { InvalidCredentialsError } from "@modules/account/infra/repositories/errors/InvalidCredentialsError";
import {
  badRequestResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";

type LoginControllerRequest = {
  email: string;
  password: string;
};

export class LoginController {
  constructor(private readonly loginRepository: ILoginRepository) {}

  async handleRequest({
    email,
    password,
  }: LoginControllerRequest): Promise<HttpResponse> {
    try {
      const token = await this.loginRepository.login({ email, password });

      return okResponse({ token });
    } catch (err) {
      if (err instanceof InvalidCredentialsError)
        return badRequestResponse(err);

      return serverErrorResponse();
    }
  }
}