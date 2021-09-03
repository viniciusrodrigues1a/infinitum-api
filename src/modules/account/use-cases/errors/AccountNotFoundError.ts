import { IAccountNotFoundErrorLanguage } from "../interfaces/languages";

export class AccountNotFoundError extends Error {
  constructor(identifier: string, language: IAccountNotFoundErrorLanguage) {
    const message = language.getAccountNotFoundErrorMessage(identifier);
    super(message);
    this.message = message;
  }
}
