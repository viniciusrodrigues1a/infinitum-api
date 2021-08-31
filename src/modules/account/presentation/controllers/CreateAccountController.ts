import { Account } from "@modules/account/entities/Account";
import { InvalidEmailError } from "@modules/account/entities/errors";
import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { ILanguage } from "../languages/ILanguage";

export type CreateAccountControllerRequest = {
  name: string;
  email: string;
  password: string;
};

export class CreateAccountController {
  constructor(
    private readonly registerAccountRepository: IRegisterAccountRepository,
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly language: ILanguage
  ) {}

  async handleRequest({
    name,
    email,
    password,
  }: CreateAccountControllerRequest): Promise<HttpResponse> {
    try {
      const account = new Account(name, email, this.language);

      const accountAlreadyExists =
        await this.doesAccountExistRepository.doesAccountExist(account.email);
      if (accountAlreadyExists) {
        throw new EmailAlreadyInUseError(email, this.language);
      }

      await this.registerAccountRepository.create({ name, email, password });

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof EmailAlreadyInUseError ||
        err instanceof InvalidEmailError
      )
        return badRequestResponse(err);

      return serverErrorResponse();
    }
  }
}
