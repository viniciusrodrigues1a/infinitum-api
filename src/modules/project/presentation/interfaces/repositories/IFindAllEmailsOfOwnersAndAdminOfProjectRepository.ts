export interface IFindAllEmailsOfOwnersAndAdminsOfProjectRepository {
  findAllEmailsOfOwnersAndAdmins(projectId: string): Promise<string[]>;
}
