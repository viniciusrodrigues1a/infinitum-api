import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type CreateIssueUseCaseDTO = AccountMakingRequestDTO & {
  projectId: string;
  title: string;
  description: string;
  expiresAt?: Date;
};
