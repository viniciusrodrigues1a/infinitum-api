export interface IRoleUpdatedTemplateLanguage {
  getRoleUpdatedText(projectName: string, roleName: string): string;
  getRoleUpdatedEmailSubject(): string;
}
