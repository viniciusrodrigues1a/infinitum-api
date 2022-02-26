export interface IInvitationTemplateLanguage {
  getInvitationText(projectName: string): string;
  getAcceptInvitationButtonText(): string;
  getDeclineInvitationButtonText(): string;
  getInvitationEmailSubject(): string;
}
