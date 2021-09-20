import { InvalidEmailError } from "@modules/account/entities/errors";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IRegisterRepository } from "../interfaces/repositories";

export type RegisterControllerRequest = {
  name: string;
  email: string;
  password: string;
};

export class RegisterController {
  constructor(
    private readonly registerAccountRepository: IRegisterRepository
  ) {}

  async handleRequest({
    name,
    email,
    password,
  }: RegisterControllerRequest): Promise<HttpResponse> {
    try {
      await this.registerAccountRepository.create({ name, email, password });

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof EmailAlreadyInUseError ||
        err instanceof InvalidEmailError
      )
        return badRequestResponse(err);

      return serverErrorResponse(err);
    }
  }
}
