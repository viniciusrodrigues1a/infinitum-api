export interface IIsProjectArchivedRepository {
  isProjectArchived(projectId: string): Promise<boolean>;
}
