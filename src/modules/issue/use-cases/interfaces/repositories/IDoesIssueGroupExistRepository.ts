export interface IDoesIssueGroupExistRepository {
  doesIssueGroupExist(issueGroupId: string): Promise<boolean>;
}
