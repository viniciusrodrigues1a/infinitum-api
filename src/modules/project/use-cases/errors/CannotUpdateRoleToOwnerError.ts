import { ICannotUpdateRoleToOwnerErrorLanguage } from "../interfaces/languages";

export class CannotUpdateRoleToOwnerError extends Error {
  constructor(language: ICannotUpdateRoleToOwnerErrorLanguage) {
    const message = language.getCannotUpdateRoleToOwnerErrorMessage();
    super(message);
    this.message = message;
  }
}
