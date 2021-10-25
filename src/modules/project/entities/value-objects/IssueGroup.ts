import { Issue } from "@modules/issue/entities";
import { Id } from "@shared/entities/value-objects";
import { IssueGroupDTO } from "../DTOs/IssueGroupDTO";

export class IssueGroup {
  issueGroupId: string;
  title: string;
  issues: Issue[];

  constructor({ title, issueGroupId, issues }: IssueGroupDTO) {
    this.issueGroupId = issueGroupId || new Id().value;
    this.title = title;
    this.issues = issues;
  }
}
