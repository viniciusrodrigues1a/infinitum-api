export interface IDeleteIssueGroupRepository {
  deleteIssueGroup(issueGroupId: string): Promise<void>;
}
