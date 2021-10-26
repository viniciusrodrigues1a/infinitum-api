import { InvalidCredentialsError } from "@modules/account/infra/repositories/errors/InvalidCredentialsError";
import {
  badRequestResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IValidation } from "@shared/presentation/validation";
import { ILoginRepository } from "../interfaces/repositories";

type LoginControllerRequest = {
  email: string;
  password: string;
};

export class LoginController implements IController {
  constructor(
    private readonly loginRepository: ILoginRepository,
    private readonly validation: IValidation
  ) {}

  async handleRequest(request: LoginControllerRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      const token = await this.loginRepository.login(request);

      return okResponse({ token });
    } catch (err) {
      if (err instanceof InvalidCredentialsError)
        return badRequestResponse(err);

      return serverErrorResponse(err);
    }
  }
}
