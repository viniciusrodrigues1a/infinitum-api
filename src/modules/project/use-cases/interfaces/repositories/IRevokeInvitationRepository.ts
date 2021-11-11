import { RevokeInvitationRepositoryDTO } from "../../DTOs";

export interface IRevokeInvitationRepository {
  revokeInvitation(data: RevokeInvitationRepositoryDTO): Promise<void>;
}
