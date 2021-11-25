import { IIssueGroupNotFoundErrorLanguage } from "../interfaces/languages";

export class IssueGroupNotFoundError extends Error {
  constructor(language: IIssueGroupNotFoundErrorLanguage) {
    const message = language.getIssueGroupNotFoundErrorMessage();
    super(message);
    this.message = message;
  }
}
