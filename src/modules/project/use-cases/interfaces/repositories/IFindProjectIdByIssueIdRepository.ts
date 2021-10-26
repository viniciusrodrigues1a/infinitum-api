export interface IFindProjectIdByIssueIdRepository {
  findProjectIdByIssueId(issueId: string): Promise<string | undefined>;
}
