import { IProjectIsArchivedErrorLanguage } from "../interfaces/languages";

export class ProjectIsArchivedError extends Error {
  constructor(language: IProjectIsArchivedErrorLanguage) {
    const message = language.getProjectIsArchivedErrorMessage();
    super(message);
    this.message = message;
  }
}
