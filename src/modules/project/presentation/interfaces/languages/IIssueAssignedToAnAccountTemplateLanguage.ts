export interface IIssueAssignedToAnAccountTemplateLanguage {
  getIssueAssignedText(issueName: string): string;
  getIssueAssignedEmailSubject(): string;
  getIssueAssignedLinkToProjectButtonText(): string;
}
