import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type ListParticipantsInvitedToProjectUseCaseDTO =
  AccountMakingRequestDTO & {
    projectId: string;
  };
