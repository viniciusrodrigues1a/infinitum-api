import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
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
import { Project } from "../entities";
import {
  IBeginsAtMustBeBeforeFinishesAtErrorLanguage,
  IInvalidRoleNameErrorLanguage,
} from "../entities/interfaces/languages";
import { Role } from "../entities/value-objects";
import { UpdateProjectUseCaseDTO } from "./DTOs";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IUpdateProjectRepository,
} from "./interfaces/repositories";

export class UpdateProjectUseCase {
  constructor(
    private readonly updateProjectRepository: IUpdateProjectRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage,
    private readonly notFutureDateErrorLanguage: INotFutureDateErrorLanguage,
    private readonly beginsAtMustBeBeforeFinishesAtErrorLanguage: IBeginsAtMustBeBeforeFinishesAtErrorLanguage
  ) {}

  async updateProject({
    projectId,
    accountEmailMakingRequest,
    name,
    description,
    beginsAt,
    finishesAt,
  }: UpdateProjectUseCaseDTO): Promise<void> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist)
      throw new ProjectNotFoundError(this.projectNotFoundErrorLanguage);

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
    if (!role.can("UPDATE_PROJECT"))
      throw new RoleInsufficientPermissionError(
        participantRoleName,
        this.roleInsufficientPermissionErrorLanguage
      );

    const project = new Project(
      {
        projectId,
        name: name as string,
        description: description as string,
        beginsAt,
        finishesAt,
      },
      this.notFutureDateErrorLanguage,
      this.beginsAtMustBeBeforeFinishesAtErrorLanguage
    );

    await this.updateProjectRepository.updateProject(project);
  }
}
