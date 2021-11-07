import {
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
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
  IFindParticipantRoleInProjectRepository,
  IHasAccountBeenInvitedToProjectRepository,
} from "./interfaces/repositories";
import { ISendInvitationToProjectEmailService } from "./interfaces/services";

export class InviteAccountToProjectUseCase {
  constructor(
    private readonly createInvitationTokenRepository: ICreateInvitationTokenRepository,
    private readonly sendInvitationToProjectEmailService: ISendInvitationToProjectEmailService,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly hasAccountBeenInvitedToProjectRepository: IHasAccountBeenInvitedToProjectRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly ownerCantBeUsedAsARoleForAnInvitationErrorLanguage: IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly accountHasAlreadyBeenInvitedErrorLanguage: IAccountHasAlreadyBeenInvitedErrorLanguage,
    private readonly accountAlreadyParticipatesInProjectErrorLanguage: IAccountAlreadyParticipatesInProjectErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async invite({
    projectId,
    projectName,
    accountEmail,
    roleName,
    accountEmailMakingRequest,
  }: InviteAccountToProjectUseCaseDTO): Promise<void> {
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

    const invitedAccountRole = new Role(
      roleName,
      this.invalidRoleNameErrorLanguage
    );

    const invitation = new Invitation(
      { projectId, accountEmail, role: invitedAccountRole },
      this.ownerCantBeUsedAsARoleForAnInvitationErrorLanguage
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
