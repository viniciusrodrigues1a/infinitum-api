export interface IFindAllEmailsParticipantInProject {
  findAllEmails(projectId: string): Promise<string[]>;
}
