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
import { KickParticipantFromProjectUseCaseDTO } from "./DTOs";
import {
  CannotKickOwnerOfProjectError,
  CannotKickYourselfError,
} from "./errors";
import {
  ICannotKickOwnerOfProjectErrorLanguage,
  ICannotKickYourselfErrorLanguage,
} from "./interfaces/languages";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";
import { IKickParticipantFromProjectRepository } from "./interfaces/repositories/IKickParticipantFromProjectRepository";

export class KickParticipantFromProjectUseCase {
  constructor(
    private readonly kickParticipantFromProjectRepository: IKickParticipantFromProjectRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly cannotKickYourselfErrorLanguage: ICannotKickYourselfErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly cannotKickOwnerOfProjectErrorLanguage: ICannotKickOwnerOfProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async kick({
    projectId,
    accountEmail,
    accountEmailMakingRequest,
  }: KickParticipantFromProjectUseCaseDTO): Promise<void> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist) {
      throw new ProjectNotFoundError(this.projectNotFoundErrorLanguage);
    }

    if (accountEmailMakingRequest === accountEmail) {
      throw new CannotKickYourselfError(this.cannotKickYourselfErrorLanguage);
    }

    const doesParticipantKickingExist =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    if (!doesParticipantKickingExist) {
      throw new NotParticipantInProjectError(
        accountEmailMakingRequest,
        this.notParticipantInProjectErrorLanguage
      );
    }

    const doesParticipantBeingKickedExist =
      await this.doesParticipantExistRepository.doesParticipantExist({
        accountEmail,
        projectId,
      });
    if (!doesParticipantBeingKickedExist) {
      throw new NotParticipantInProjectError(
        accountEmail,
        this.notParticipantInProjectErrorLanguage
      );
    }

    const accountBeingKickedRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        accountEmail,
        projectId,
      });
    if (accountBeingKickedRole === "owner") {
      throw new CannotKickOwnerOfProjectError(
        this.cannotKickOwnerOfProjectErrorLanguage
      );
    }

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        accountEmail: accountEmailMakingRequest,
        projectId,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("KICK_ACCOUNT_FROM_PROJECT")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    await this.kickParticipantFromProjectRepository.kickParticipant({
      projectId,
      accountEmail,
    });
  }
}
