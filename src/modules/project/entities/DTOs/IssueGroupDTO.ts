import { Issue } from "@modules/issue/entities";

export type IssueGroupDTO = {
  issueGroupId?: string;
  title: string;
  issues: Issue[];
};
