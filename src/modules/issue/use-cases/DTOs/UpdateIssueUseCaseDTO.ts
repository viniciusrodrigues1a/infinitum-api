import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type UpdateIssueUseCaseDTO = AccountMakingRequestDTO & {
  issueId: string;
  newTitle?: string;
  newDescription?: string;
  newExpiresAt?: Date | null;
  newCompleted?: boolean;
};
