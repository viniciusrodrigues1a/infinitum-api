export interface IProjectDeletedTemplateLanguage {
  getProjectDeletedText(projectName: string): string;
  getProjectDeletedEmailSubject(): string;
}
