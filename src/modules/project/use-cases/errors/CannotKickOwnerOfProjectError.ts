import { ICannotKickOwnerOfProjectErrorLanguage } from "../interfaces/languages";

export class CannotKickOwnerOfProjectError extends Error {
  constructor(language: ICannotKickOwnerOfProjectErrorLanguage) {
    const message = language.getCannotKickOwnerOfProjectErrorMessage();
    super(message);
    this.message = message;
  }
}
