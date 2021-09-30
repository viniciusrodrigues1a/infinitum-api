import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "@shared/use-cases/interfaces/repositories";
import { DeleteProjectDTO } from "./DTOs/DeleteProjectDTO";
import { IDeleteProjectRepository } from "./interfaces/repositories";

export class DeleteProjectUseCase {
  constructor(
    private readonly deleteProjectRepository: IDeleteProjectRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage
  ) {}

  async delete({
    projectId,
    accountEmailMakingRequest,
  }: DeleteProjectDTO): Promise<void> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist)
      throw new ProjectNotFoundError(
        projectId,
        this.projectNotFoundErrorLanguage
      );

    const doesParticipantExist =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    if (!doesParticipantExist)
      throw new NotParticipantInProjectError(
        accountEmailMakingRequest,
        this.notParticipantInProjectErrorLanguage
      );

    await this.deleteProjectRepository.deleteProject(projectId);
  }
}
