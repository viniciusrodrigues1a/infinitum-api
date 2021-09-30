import {
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "@shared/use-cases/interfaces/repositories";
import { DeleteProjectDTO } from "./DTOs/DeleteProjectDTO";
import { IDeleteProjectRepository } from "./interfaces/repositories";

export class DeleteProjectUseCase {
  constructor(
    private readonly deleteProjectRepository: IDeleteProjectRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository
  ) {}

  async delete({}: DeleteProjectDTO): Promise<void> {}
}
