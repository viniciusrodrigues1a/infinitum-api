import { InvalidEmailError } from "@modules/account/entities/errors";
import { Email } from "@modules/account/entities/value-objects/Email";
import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
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
    private readonly registerAccountRepository: IRegisterAccountRepository,
    private readonly doesAccountExistRepository: IDoesAccountExistRepository
  ) {}

  async handleRequest({
    name,
    email,
    password,
  }: CreateAccountControllerRequest): Promise<HttpResponse> {
    try {
      const validatedEmail = new Email(email).value;

      const accountAlreadyExists =
        await this.doesAccountExistRepository.doesAccountExist(validatedEmail);
      if (accountAlreadyExists) {
        throw new EmailAlreadyInUseError(email);
      }

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
