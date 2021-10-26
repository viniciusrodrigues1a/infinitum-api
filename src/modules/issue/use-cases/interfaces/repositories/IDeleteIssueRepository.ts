export interface IDeleteIssueRepository {
  deleteIssue(issueId: string): Promise<void>;
}
