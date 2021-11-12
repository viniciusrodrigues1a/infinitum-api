import { UpdateParticipantRoleInProjectRepositoryDTO } from "../../DTOs";

export interface IUpdateParticipantRoleInProjectRepository {
  updateParticipantRole(
    data: UpdateParticipantRoleInProjectRepositoryDTO
  ): Promise<void>;
}
