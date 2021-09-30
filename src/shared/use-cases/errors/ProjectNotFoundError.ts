import { IProjectNotFoundErrorLanguage } from "../interfaces/languages";

export class ProjectNotFoundError extends Error {
  constructor(identifier: string, language: IProjectNotFoundErrorLanguage) {
    const message = language.getProjectNotFoundErrorMessage(identifier);
    super(message);
    this.message = message;
  }
}
