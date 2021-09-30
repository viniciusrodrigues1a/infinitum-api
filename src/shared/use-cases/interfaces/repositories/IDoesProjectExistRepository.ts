export interface IDoesProjectExistRepository {
  doesProjectExist(projectId: string): Promise<boolean>;
}
