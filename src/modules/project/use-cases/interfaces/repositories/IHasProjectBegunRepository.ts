export interface IHasProjectBegunRepository {
  hasProjectBegun(projectId: string): Promise<boolean>;
}
