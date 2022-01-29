export interface IFindStartDateByProjectIdRepository {
  findStartDate(projectId: string): Promise<Date | null>;
}
