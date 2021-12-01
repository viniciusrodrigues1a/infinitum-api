import { IssueDTO } from "@modules/issue/entities/DTOs";

export type CreateIssueRepositoryDTO = Required<
  Omit<IssueDTO, "assignedToEmail" | "expiresAt" | "completed" | "description">
> & {
  issueGroupId: string;
  description?: string;
  expiresAt?: Date;
};
