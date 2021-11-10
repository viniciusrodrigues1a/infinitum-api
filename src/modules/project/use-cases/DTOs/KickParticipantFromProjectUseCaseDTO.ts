import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type KickParticipantFromProjectUseCaseDTO = AccountMakingRequestDTO & {
  projectId: string;
  accountEmail: string;
};
