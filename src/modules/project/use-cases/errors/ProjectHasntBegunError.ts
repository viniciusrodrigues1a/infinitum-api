import { IProjectHasntBegunErrorLanguage } from "../interfaces/languages";

export class ProjectHasntBegunError extends Error {
  constructor(date: Date, language: IProjectHasntBegunErrorLanguage) {
    const message = language.getProjectHasntBegunErrorMessage(date);
    super(message);
    this.message = message;
  }
}
