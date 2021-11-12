import { ICannotUpdateRoleOfOwnerErrorLanguage } from "../interfaces/languages";

export class CannotUpdateRoleOfOwnerError extends Error {
  constructor(language: ICannotUpdateRoleOfOwnerErrorLanguage) {
    const message = language.getCannotUpdateRoleOfOwnerMessage();
    super(message);
    this.message = message;
  }
}
