export interface IDeleteProjectRepository {
  deleteProject(projectId: string): Promise<void>;
}
