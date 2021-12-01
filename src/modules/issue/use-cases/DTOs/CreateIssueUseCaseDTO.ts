import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type CreateIssueUseCaseDTO = AccountMakingRequestDTO & {
  issueGroupId: string;
  title: string;
  description?: string;
  expiresAt?: Date;
};
