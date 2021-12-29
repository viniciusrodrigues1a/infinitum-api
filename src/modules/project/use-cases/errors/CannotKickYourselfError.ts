import { ICannotKickYourselfErrorLanguage } from "../interfaces/languages";

export class CannotKickYourselfError extends Error {
  constructor(language: ICannotKickYourselfErrorLanguage) {
    const message = language.getCannotKickYourselfErrorMessage();
    super(message);
    this.message = message;
  }
}
