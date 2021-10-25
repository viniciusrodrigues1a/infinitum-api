import { IProjectHasntBegunErrorLanguage } from "../interfaces/languages";

export class ProjectHasntBegunError extends Error {
  constructor(language: IProjectHasntBegunErrorLanguage) {
    const message = language.getProjectHasntBegunErrorMessage();
    super(message);
    this.message = message;
  }
}
