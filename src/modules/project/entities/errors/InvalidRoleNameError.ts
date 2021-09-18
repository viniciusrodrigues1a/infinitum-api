import { IInvalidRoleNameErrorLanguage } from "../interfaces/languages";

export class InvalidRoleNameError extends Error {
  constructor(name: string, language: IInvalidRoleNameErrorLanguage) {
    const message = language.getInvalidRoleNameErrorLanguage(name);
    super(message);
    this.message = message;
  }
}
