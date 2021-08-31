import { IInvalidEmailErrorLanguage } from "../interfaces/languages";

export class InvalidEmailError extends Error {
  constructor(language: IInvalidEmailErrorLanguage) {
    const message = language.getInvalidEmailErrorMessage();
    super(message);
    this.message = message;
  }
}
