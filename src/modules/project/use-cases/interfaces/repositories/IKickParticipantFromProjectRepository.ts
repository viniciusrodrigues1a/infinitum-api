import { KickParticipantFromProjectRepositoryDTO } from "../../DTOs";

export interface IKickParticipantFromProjectRepository {
  kickParticipant(data: KickParticipantFromProjectRepositoryDTO): Promise<void>;
}
