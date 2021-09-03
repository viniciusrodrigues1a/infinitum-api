import { IInvalidPasswordErrorLanguage } from "@modules/account/presentation/languages/IInvalidPasswordErrorLanguage";

export class InvalidPasswordError extends Error {
  constructor(language: IInvalidPasswordErrorLanguage) {
    const message = language.getInvalidPasswordErrorMessage();
    super(message);
    this.message = message;
  }
}
