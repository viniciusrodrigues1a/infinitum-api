import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type RevokeInvitationUseCaseDTO = AccountMakingRequestDTO & {
  projectId: string;
  accountEmail: string;
};
