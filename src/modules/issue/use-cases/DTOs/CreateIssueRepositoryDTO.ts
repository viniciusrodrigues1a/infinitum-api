import { IssueDTO } from "@modules/issue/entities/DTOs";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type CreateIssueUseCaseDTO = AccountMakingRequestDTO &
  Required<Omit<IssueDTO, "assignedTo">> & {
    projectId: string;
  };
