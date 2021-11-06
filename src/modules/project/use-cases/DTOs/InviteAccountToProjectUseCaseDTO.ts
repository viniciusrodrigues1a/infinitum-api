import { InvitationDTO } from "@modules/project/entities/DTOs";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type InviteAccountToProjectUseCaseDTO = AccountMakingRequestDTO &
  Omit<InvitationDTO, "role"> & {
    projectName: string;
    roleName: string;
  };
