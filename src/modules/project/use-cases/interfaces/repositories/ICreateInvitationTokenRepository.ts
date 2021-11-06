import { CreateInvitationTokenRepositoryDTO } from "../../DTOs";

export interface ICreateInvitationTokenRepository {
  createInvitationToken(
    data: CreateInvitationTokenRepositoryDTO
  ): Promise<void>;
}
