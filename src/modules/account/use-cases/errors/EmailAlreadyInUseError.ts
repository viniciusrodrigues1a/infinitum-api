import { IEmailAlreadyInUseErrorLanguage } from "../interfaces/languages";

export class EmailAlreadyInUseError extends Error {
  constructor(email: string, language: IEmailAlreadyInUseErrorLanguage) {
    const message = language.getEmailAlreadyInUseErrorMessage(email);
    super(message);
    this.message = message;
  }
}
