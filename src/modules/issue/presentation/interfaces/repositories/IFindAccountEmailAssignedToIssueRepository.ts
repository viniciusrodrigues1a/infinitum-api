export interface IFindAccountEmailAssignedToIssueRepository {
  findAccountEmailAssignedToIssue(issueId: string): Promise<string | undefined>;
}
