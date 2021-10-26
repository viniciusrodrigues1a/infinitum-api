import { IIssueNotFoundErrorLanguage } from "../interfaces/languages";

export class IssueNotFoundError extends Error {
  constructor(language: IIssueNotFoundErrorLanguage) {
    const message = language.getIssueNotFoundErrorMessage();
    super(message);
    this.message = message;
  }
}
