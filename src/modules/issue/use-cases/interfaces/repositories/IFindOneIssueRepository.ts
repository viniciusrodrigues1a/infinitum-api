import { Issue } from "@modules/issue/entities";

export interface IFindOneIssueRepository {
  findOneIssue(issueId: string): Promise<Issue | undefined>;
}
