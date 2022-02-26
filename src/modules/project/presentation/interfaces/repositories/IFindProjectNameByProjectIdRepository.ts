export interface IFindProjectNameByProjectIdRepository {
  findProjectNameByProjectId(projectId: string): Promise<string>;
}
