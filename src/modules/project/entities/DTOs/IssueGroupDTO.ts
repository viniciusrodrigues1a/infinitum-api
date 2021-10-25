import { Issue } from "@modules/issue/Issue";

export type IssueGroupDTO = {
  issueGroupId?: string;
  title: string;
  issues: Issue[];
};
