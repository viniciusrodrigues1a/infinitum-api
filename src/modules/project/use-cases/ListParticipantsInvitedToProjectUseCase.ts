import { Account } from "@modules/account/entities/Account";
import {
  ProjectNotFoundError,
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  IProjectNotFoundErrorLanguage,
  INotParticipantInProjectErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import { Role } from "../entities/value-objects";
import { ListParticipantsInvitedToProjectUseCaseDTO } from "./DTOs";
import {
  IListParticipantsInvitedToProjectRepository,
  IDoesProjectExistRepository,
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";

export class ListParticipantsInvitedToProjectUseCase {
  constructor(
    private readonly listParticipantsInvitedToProjectRepository: IListParticipantsInvitedToProjectRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async listParticipants({
    projectId,
    accountEmailMakingRequest,
  }: ListParticipantsInvitedToProjectUseCaseDTO): Promise<Account[]> {
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

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("LIST_INVITED_PARTICIPANTS")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    const participants =
      await this.listParticipantsInvitedToProjectRepository.listParticipants(
        projectId
      );

    return participants;
  }
}
