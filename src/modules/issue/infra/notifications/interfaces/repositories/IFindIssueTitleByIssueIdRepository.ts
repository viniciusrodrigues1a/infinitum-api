export interface IFindIssueTitleByIssueIdRepository {
  findIssueTitle(issueId: string): Promise<string>;
}
