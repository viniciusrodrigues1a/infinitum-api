import { IProjectNotFoundErrorLanguage } from "../interfaces/languages";

export class ProjectNotFoundError extends Error {
  constructor(language: IProjectNotFoundErrorLanguage) {
    const message = language.getProjectNotFoundErrorMessage();
    super(message);
    this.message = message;
  }
}
