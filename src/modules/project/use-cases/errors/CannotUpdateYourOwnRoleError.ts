import { ICannotUpdateYourOwnRoleErrorLanguage } from "../interfaces/languages";

export class CannotUpdateYourOwnRoleError extends Error {
  constructor(language: ICannotUpdateYourOwnRoleErrorLanguage) {
    const message = language.getCannotUpdateYourOwnRoleErrorMessage();
    super(message);
    this.message = message;
  }
}
