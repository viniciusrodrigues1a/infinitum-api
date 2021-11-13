import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import { Role } from "../entities/value-objects";
import { UpdateParticipantRoleInProjectUseCaseDTO } from "./DTOs";
import {
  CannotUpdateRoleOfOwnerError,
  CannotUpdateRoleToOwnerError,
  CannotUpdateYourOwnRoleError,
} from "./errors";
import {
  ICannotUpdateRoleOfOwnerErrorLanguage,
  ICannotUpdateRoleToOwnerErrorLanguage,
  ICannotUpdateYourOwnRoleErrorLanguage,
} from "./interfaces/languages";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IUpdateParticipantRoleInProjectRepository,
} from "./interfaces/repositories";

export class UpdateParticipantRoleInProjectUseCase {
  constructor(
    private readonly updateParticipantRoleInProjectRepository: IUpdateParticipantRoleInProjectRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly cannotUpdateRoleToOwnerErrorLanguage: ICannotUpdateRoleToOwnerErrorLanguage,
    private readonly cannotUpdateYourOwnRoleErrorLanguage: ICannotUpdateYourOwnRoleErrorLanguage,
    private readonly cannotUpdateRoleOfOwnerErrorLanguage: ICannotUpdateRoleOfOwnerErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async updateParticipantRole({
    roleName,
    projectId,
    accountEmail,
    accountEmailMakingRequest,
  }: UpdateParticipantRoleInProjectUseCaseDTO): Promise<void> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist) {
      throw new ProjectNotFoundError(this.projectNotFoundErrorLanguage);
    }

    const doesAccountRequestingUpdateParticipatesInProject =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    if (!doesAccountRequestingUpdateParticipatesInProject) {
      throw new NotParticipantInProjectError(
        accountEmailMakingRequest,
        this.notParticipantInProjectErrorLanguage
      );
    }

    const doesAccountBeingUpdatedParticipatesInProject =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail,
      });
    if (!doesAccountBeingUpdatedParticipatesInProject) {
      throw new NotParticipantInProjectError(
        accountEmail,
        this.notParticipantInProjectErrorLanguage
      );
    }

    if (roleName === "owner") {
      throw new CannotUpdateRoleToOwnerError(
        this.cannotUpdateRoleToOwnerErrorLanguage
      );
    }

    if (accountEmail === accountEmailMakingRequest) {
      throw new CannotUpdateYourOwnRoleError(
        this.cannotUpdateYourOwnRoleErrorLanguage
      );
    }

    /* eslint-disable-next-line */
    new Role(roleName, this.invalidRoleNameErrorLanguage);

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("UPDATE_PARTICIPANT_ROLE")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    const participantBeingUpdatedRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        accountEmail,
        projectId,
      });
    if (participantBeingUpdatedRole === "owner") {
      throw new CannotUpdateRoleOfOwnerError(
        this.cannotUpdateRoleOfOwnerErrorLanguage
      );
    }

    await this.updateParticipantRoleInProjectRepository.updateParticipantRole({
      roleName,
      projectId,
      accountEmail,
    });
  }
}
