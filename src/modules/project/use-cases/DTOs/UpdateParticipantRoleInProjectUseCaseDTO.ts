import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type UpdateParticipantRoleInProjectUseCaseDTO =
  AccountMakingRequestDTO & {
    projectId: string;
    accountEmail: string;
    roleName: string;
  };
