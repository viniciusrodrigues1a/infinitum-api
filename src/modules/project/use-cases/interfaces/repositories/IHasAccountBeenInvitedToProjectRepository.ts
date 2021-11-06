import { DoesParticipantExistRepositoryDTO } from "@shared/use-cases/DTOs";

export interface IHasAccountBeenInvitedToProjectRepository {
  hasAccountBeenInvited(
    data: DoesParticipantExistRepositoryDTO
  ): Promise<boolean>;
}
