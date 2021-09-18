import { INotFutureDateErrorLanguage } from "../interfaces/languages";

export class NotFutureDateError extends Error {
  constructor(date: Date, language: INotFutureDateErrorLanguage) {
    const message = language.getNotFutureDateErrorMessage(date);
    super(message);
    this.message = message;
  }
}
