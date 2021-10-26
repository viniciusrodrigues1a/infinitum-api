export interface IFindProjectIdByIssueGroupIdRepository {
  findProjectIdByIssueGroupId(
    issueGroupId: string
  ): Promise<string | undefined>;
}
