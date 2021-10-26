export interface IDoesIssueExistRepository {
  doesIssueExist(issueId: string): Promise<boolean>;
}
