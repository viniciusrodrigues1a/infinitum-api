import { DoesParticipantExistRepositoryDTO } from "@shared/use-cases/DTOs";

export interface IDoesParticipantExistRepository {
  doesParticipantExist(
    data: DoesParticipantExistRepositoryDTO
  ): Promise<boolean>;
}
