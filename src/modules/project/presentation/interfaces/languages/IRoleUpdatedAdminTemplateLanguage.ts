export interface IRoleUpdatedAdminTemplateLanguage {
  getRoleUpdatedAdminText(
    email: string,
    projectName: string,
    roleName: string
  ): string;
  getRoleUpdatedAdminLinkToProjectButtonText(): string;
  getRoleUpdatedAdminEmailSubject(): string;
}
