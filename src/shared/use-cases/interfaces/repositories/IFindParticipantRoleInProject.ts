import { FindParticipantRoleInProjectRepositoryDTO } from "@shared/use-cases/DTOs";

export interface IFindParticipantRoleInProjectRepository {
  findParticipantRole(
    data: FindParticipantRoleInProjectRepositoryDTO
  ): Promise<string>;
}
