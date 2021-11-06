import { InvitationDTO } from "@modules/project/entities/DTOs";
import { InvitationToken } from "@modules/project/entities/value-objects/InvitationToken";

export type CreateInvitationTokenRepositoryDTO = Omit<InvitationDTO, "role"> & {
  roleName: string;
  token: InvitationToken;
};
