import { IssueGroupDTO } from "@modules/project/entities/DTOs/IssueGroupDTO";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type CreateIssueGroupForProjectUseCaseDTO = Omit<
  IssueGroupDTO,
  "issueGroupId" | "issues"
> &
  AccountMakingRequestDTO & {
    projectId: string;
  };
