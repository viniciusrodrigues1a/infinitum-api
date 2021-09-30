import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "@shared/use-cases/interfaces/repositories";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import { Role } from "../entities/value-objects";
import { DeleteProjectDTO } from "./DTOs/DeleteProjectDTO";
import { IDeleteProjectRepository } from "./interfaces/repositories";

export class DeleteProjectUseCase {
  constructor(
    private readonly deleteProjectRepository: IDeleteProjectRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
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

    const participantRoleName =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(
      participantRoleName,
      this.invalidRoleNameErrorLanguage
    );
    if (!role.can("DELETE_PROJECT"))
      throw new RoleInsufficientPermissionError(
        participantRoleName,
        this.roleInsufficientPermissionErrorLanguage
      );

    await this.deleteProjectRepository.deleteProject(projectId);
  }
}
