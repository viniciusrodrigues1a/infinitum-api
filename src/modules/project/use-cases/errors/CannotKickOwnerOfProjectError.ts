import { ICannotKickOwnerOfProjectErrorLanguage } from "../interfaces/languages";

export class CannotKickOwnerOfProjectError extends Error {
  constructor(language: ICannotKickOwnerOfProjectErrorLanguage) {
    const message = language.getCannotKickOwnerOfProjectErrorLanguage();
    super(message);
    this.message = message;
  }
}
