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
import { Invitation } from "../entities";
import {
  IInvalidRoleNameErrorLanguage,
  IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
} from "../entities/interfaces/languages";
import { Role } from "../entities/value-objects";
import { InviteAccountToProjectUseCaseDTO } from "./DTOs";
import {
  AccountAlreadyParticipatesInProjectError,
  AccountHasAlreadyBeenInvitedError,
} from "./errors";
import {
  IAccountAlreadyParticipatesInProjectErrorLanguage,
  IAccountHasAlreadyBeenInvitedErrorLanguage,
} from "./interfaces/languages";
import {
  ICreateInvitationTokenRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectNameByProjectIdRepository,
  IHasAccountBeenInvitedToProjectRepository,
} from "./interfaces/repositories";
import { ISendInvitationToProjectEmailService } from "./interfaces/services";

export class InviteAccountToProjectUseCase {
  constructor(
    private readonly createInvitationTokenRepository: ICreateInvitationTokenRepository,
    private readonly sendInvitationToProjectEmailService: ISendInvitationToProjectEmailService,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly hasAccountBeenInvitedToProjectRepository: IHasAccountBeenInvitedToProjectRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly findProjectNameByProjectIdRepository: IFindProjectNameByProjectIdRepository,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly ownerCantBeUsedAsARoleForAnInvitationErrorLanguage: IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly accountNotFoundErrorLanguage: IAccountNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly accountHasAlreadyBeenInvitedErrorLanguage: IAccountHasAlreadyBeenInvitedErrorLanguage,
    private readonly accountAlreadyParticipatesInProjectErrorLanguage: IAccountAlreadyParticipatesInProjectErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async invite({
    projectId,
    accountEmail,
    roleName,
    accountEmailMakingRequest,
  }: InviteAccountToProjectUseCaseDTO): Promise<void> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist) {
      throw new ProjectNotFoundError(this.projectNotFoundErrorLanguage);
    }

    const doesAccountInvitingParticipatesInProject =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    if (!doesAccountInvitingParticipatesInProject) {
      throw new NotParticipantInProjectError(
        accountEmailMakingRequest,
        this.notParticipantInProjectErrorLanguage
      );
    }

    const accountInvitingRoleName =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        accountEmail: accountEmailMakingRequest,
        projectId,
      });
    const accountInvitingRole = new Role(
      accountInvitingRoleName,
      this.invalidRoleNameErrorLanguage
    );
    if (!accountInvitingRole.can("INVITE_ACCOUNT_TO_PROJECT")) {
      throw new RoleInsufficientPermissionError(
        accountInvitingRoleName,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    const doesAccountBeingInvitedExists =
      await this.doesAccountExistRepository.doesAccountExist(accountEmail);
    if (!doesAccountBeingInvitedExists) {
      throw new AccountNotFoundError(
        accountEmail,
        this.accountNotFoundErrorLanguage
      );
    }
    const doesAccountBeingInvitedParticipatesInProject =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail,
      });
    if (doesAccountBeingInvitedParticipatesInProject) {
      throw new AccountAlreadyParticipatesInProjectError(
        accountEmail,
        this.accountAlreadyParticipatesInProjectErrorLanguage
      );
    }

    const hasAccountBeenInvited =
      await this.hasAccountBeenInvitedToProjectRepository.hasAccountBeenInvited(
        { projectId, accountEmail }
      );
    if (hasAccountBeenInvited) {
      throw new AccountHasAlreadyBeenInvitedError(
        accountEmail,
        this.accountHasAlreadyBeenInvitedErrorLanguage
      );
    }

    const invitedAccountRole = new Role(
      roleName,
      this.invalidRoleNameErrorLanguage
    );

    const invitation = new Invitation(
      { projectId, accountEmail, role: invitedAccountRole },
      this.ownerCantBeUsedAsARoleForAnInvitationErrorLanguage
    );

    const projectName =
      await this.findProjectNameByProjectIdRepository.findProjectNameByProjectId(
        projectId
      );

    await this.createInvitationTokenRepository.createInvitationToken({
      accountEmail,
      projectId,
      roleName,
      token: invitation.token,
    });
    await this.sendInvitationToProjectEmailService.sendInvitationEmail({
      token: invitation.token,
      projectName,
      email: accountEmail,
    });
  }
}
