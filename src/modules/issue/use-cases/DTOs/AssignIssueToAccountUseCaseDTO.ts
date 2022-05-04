import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type AssignIssueToAccountUseCaseDTO = AccountMakingRequestDTO & {
  issueId: string;
  assignedToEmail: string | null;
};
