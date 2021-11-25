export interface IShouldIssueGroupUpdateIssuesToCompletedRepository {
  shouldIssueGroupUpdateIssues(issueGroupId: string): Promise<boolean>;
}
