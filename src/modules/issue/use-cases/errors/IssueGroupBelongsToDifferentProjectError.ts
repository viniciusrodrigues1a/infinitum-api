import { IIssueGroupBelongsToDifferentProjectErrorLanguage } from "../interfaces/languages/IIssueGroupBelongsToDifferentProjectErrorLanguage";

export class IssueGroupBelongsToDifferentProjectError extends Error {
  constructor(language: IIssueGroupBelongsToDifferentProjectErrorLanguage) {
    const message =
      language.getIssueGroupBelongsToDifferentProjectErrorMessage();
    super(message);
    this.message = message;
  }
}
