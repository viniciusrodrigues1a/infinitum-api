import { IssueGroupDTO } from "@modules/project/entities/DTOs/IssueGroupDTO";

export type CreateIssueGroupForProjectRepositoryDTO = Omit<
  Required<IssueGroupDTO>,
  "issues"
> & {
  projectId: string;
};
