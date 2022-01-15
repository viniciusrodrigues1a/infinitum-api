import { InvitationToken } from "@modules/project/entities/value-objects";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type AcceptInvitationToProjectUseCaseDTO = AccountMakingRequestDTO & {
  token: InvitationToken;
};
