export interface IKickedAdminTemplateLanguage {
  getKickedAdminText(email: string, projectName: string): string;
  getKickedAdminLinkToProjectButtonText(): string;
  getKickedAdminEmailSubject(): string;
}
