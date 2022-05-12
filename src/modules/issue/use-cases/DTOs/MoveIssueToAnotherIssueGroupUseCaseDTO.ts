import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type MoveIssueToAnotherIssueGroupUseCaseDTO = AccountMakingRequestDTO & {
  issueId: string;
  moveToIssueGroupId: string;
  orderAfter?: string;
  orderBefore?: string;
};
