import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages";

export class InvalidCredentialsError extends Error {
  constructor(language: IInvalidCredentialsErrorLanguage) {
    const message = language.getInvalidCredentialsErrorMessage();
    super(message);
    this.message = message;
  }
}
