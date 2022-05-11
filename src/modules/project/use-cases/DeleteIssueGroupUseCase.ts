import { IssueGroupNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueGroupNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import { IDoesIssueGroupExistRepository } from "@modules/issue/use-cases/interfaces/repositories";
import {
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import { Role } from "../entities/value-objects";
import { DeleteIssueGroupUseCaseDTO } from "./DTOs";
import {
  IDeleteIssueGroupRepository,
  IFindProjectIdByIssueGroupIdRepository,
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";

export class DeleteIssueGroupUseCase {
  constructor(
    private readonly deleteIssueGroupRepository: IDeleteIssueGroupRepository,
    private readonly doesIssueGroupExist: IDoesIssueGroupExistRepository,
    private readonly findProjectIdByIssueGroupIdRepository: IFindProjectIdByIssueGroupIdRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly issueGroupNotFoundErrorLanguage: IIssueGroupNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async deleteIssueGroup({
    issueGroupId,
    accountEmailMakingRequest,
  }: DeleteIssueGroupUseCaseDTO): Promise<void> {
    const doesIssueGroupExist =
      await this.doesIssueGroupExist.doesIssueGroupExist(issueGroupId);
    if (!doesIssueGroupExist) {
      throw new IssueGroupNotFoundError(this.issueGroupNotFoundErrorLanguage);
    }

    const projectId =
      (await this.findProjectIdByIssueGroupIdRepository.findProjectIdByIssueGroupId(
        issueGroupId
      )) as string;

    const doesParticipantExist =
      await this.doesParticipantExistRepository.doesParticipantExist({
        accountEmail: accountEmailMakingRequest,
        projectId,
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
    if (!role.can("DELETE_ISSUE_GROUP")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    await this.deleteIssueGroupRepository.deleteIssueGroup(issueGroupId);
  }
}
