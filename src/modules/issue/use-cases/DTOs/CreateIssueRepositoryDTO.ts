import { IssueDTO } from "@modules/issue/entities/DTOs";

export type CreateIssueRepositoryDTO = Required<
  Omit<IssueDTO, "assignedToEmail" | "expiresAt">
> & {
  issueGroupId: string;
  expiresAt?: Date;
};
