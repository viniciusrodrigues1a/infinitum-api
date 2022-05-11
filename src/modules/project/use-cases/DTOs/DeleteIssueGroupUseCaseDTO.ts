import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type DeleteIssueGroupUseCaseDTO = AccountMakingRequestDTO & {
  issueGroupId: string;
};
