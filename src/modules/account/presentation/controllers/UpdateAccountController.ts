import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IEmailAlreadyInUseErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import {
  badRequestResponse,
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import {
  IUpdateAccountImageRepository,
  IUpdateAccountRepository,
} from "../interfaces/repositories";

export type UpdateAccountControllerRequest = AccountMakingRequestDTO & {
  name?: string;
  email?: string;
  password?: string;
  languageId?: string;
  fileBuffer?: Buffer;
};

export class UpdateAccountController implements IController {
  constructor(
    private readonly updateAccountRepository: IUpdateAccountRepository,
    private readonly updateAccountImageRepository: IUpdateAccountImageRepository,
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly emailAlreadyInUseErrorLanguage: IEmailAlreadyInUseErrorLanguage
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
    name,
    email,
    password,
    languageId,
    fileBuffer,
  }: UpdateAccountControllerRequest): Promise<HttpResponse> {
    try {
      if (email) {
        const accountAlreadyExists =
          await this.doesAccountExistRepository.doesAccountExist(email);

        if (accountAlreadyExists) {
          throw new EmailAlreadyInUseError(
            email,
            this.emailAlreadyInUseErrorLanguage
          );
        }
      }

      if (fileBuffer) {
        await this.updateAccountImageRepository.updateAccountImage({
          email: accountEmailMakingRequest,
          fileBuffer,
        });
      }

      this.updateAccountRepository.updateAccount({
        email: accountEmailMakingRequest,
        newName: name,
        newEmail: email,
        newPassword: password,
        newLanguageId: languageId,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof EmailAlreadyInUseError) return badRequestResponse(err);

      return serverErrorResponse(err);
    }
  }
}
