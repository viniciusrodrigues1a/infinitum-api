import { InvalidEmailError } from "@modules/account/entities/errors";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IValidation } from "@shared/presentation/validation";
import { IRegisterRepository } from "../interfaces/repositories";

export type RegisterControllerRequest = {
  name: string;
  email: string;
  password: string;
};

export class RegisterController implements IController {
  constructor(
    private readonly registerAccountRepository: IRegisterRepository,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: RegisterControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.registerAccountRepository.create(request);

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
