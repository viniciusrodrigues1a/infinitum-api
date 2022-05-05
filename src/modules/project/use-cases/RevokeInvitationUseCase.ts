import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
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
import { RevokeInvitationUseCaseDTO } from "./DTOs";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IRevokeInvitationRepository,
} from "./interfaces/repositories";

export class RevokeInvitationUseCase {
  constructor(
    private readonly revokeInvitationRepository: IRevokeInvitationRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly accountNotFoundErrorLanguage: IAccountNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async revokeInvitation({
    projectId,
    accountEmail,
    accountEmailMakingRequest,
  }: RevokeInvitationUseCaseDTO): Promise<void> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist) {
      throw new ProjectNotFoundError(this.projectNotFoundErrorLanguage);
    }

    const doesParticipantExist =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    if (!doesParticipantExist) {
      throw new NotParticipantInProjectError(
        accountEmailMakingRequest,
        this.notParticipantInProjectErrorLanguage
      );
    }

    if (accountEmail !== accountEmailMakingRequest) {
      const participantRole =
        await this.findParticipantRoleInProjectRepository.findParticipantRole({
          accountEmail: accountEmailMakingRequest,
          projectId,
        });
      const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
      if (!role.can("REVOKE_INVITATION")) {
        throw new RoleInsufficientPermissionError(
          participantRole,
          this.roleInsufficientPermissionErrorLanguage
        );
      }
    }

    const doesAccountExist =
      await this.doesAccountExistRepository.doesAccountExist(accountEmail);
    if (!doesAccountExist) {
      throw new AccountNotFoundError(
        accountEmail,
        this.accountNotFoundErrorLanguage
      );
    }

    await this.revokeInvitationRepository.revokeInvitation({
      projectId,
      accountEmail,
    });
  }
}
