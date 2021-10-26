import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type DeleteIssueUseCaseDTO = AccountMakingRequestDTO & {
  issueId: string;
};
