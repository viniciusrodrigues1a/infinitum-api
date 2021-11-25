import {
  IssueGroupBelongsToDifferentProjectError,
  IssueGroupNotFoundError,
  IssueNotFoundError,
} from "@modules/issue/use-cases/errors";
import {
  IIssueGroupBelongsToDifferentProjectErrorLanguage,
  IIssueGroupNotFoundErrorLanguage,
  IIssueNotFoundErrorLanguage,
} from "@modules/issue/use-cases/interfaces/languages";
import {
  IDoesIssueExistRepository,
  IDoesIssueGroupExistRepository,
  IMoveIssueToAnotherIssueGroupRepository,
  IShouldIssueGroupUpdateIssuesToCompletedRepository,
  IUpdateIssueRepository,
} from "@modules/issue/use-cases/interfaces/repositories";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { Role } from "@modules/project/entities/value-objects";
import {
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueGroupIdRepository,
  IFindProjectIdByIssueIdRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors";
import { IRoleInsufficientPermissionErrorLanguage } from "@shared/use-cases/interfaces/languages";
import { MoveIssueToAnotherIssueGroupUseCaseDTO } from "./DTOs";

export class MoveIssueToAnotherIssueGroupUseCase {
  constructor(
    private readonly moveIssueToAnotherIssueGroupRepository: IMoveIssueToAnotherIssueGroupRepository,
    private readonly doesIssueExistRepository: IDoesIssueExistRepository,
    private readonly doesIssueGroupExistRepository: IDoesIssueGroupExistRepository,
    private readonly findProjectIdByIssueGroupIdRepository: IFindProjectIdByIssueGroupIdRepository,
    private readonly findProjectIdByIssueIdRepository: IFindProjectIdByIssueIdRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly shouldIssueGroupUpdateIssuesToCompleted: IShouldIssueGroupUpdateIssuesToCompletedRepository,
    private readonly updateIssueRepository: IUpdateIssueRepository,
    private readonly issueNotFoundErrorLanguage: IIssueNotFoundErrorLanguage,
    private readonly issueGroupNotFoundErrorLanguage: IIssueGroupNotFoundErrorLanguage,
    private readonly issueGroupBelongsToDifferentProjectErrorLanguage: IIssueGroupBelongsToDifferentProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async moveIssue({
    issueId,
    moveToIssueGroupId,
    accountEmailMakingRequest,
  }: MoveIssueToAnotherIssueGroupUseCaseDTO): Promise<void> {
    const doesIssueExist = await this.doesIssueExistRepository.doesIssueExist(
      issueId
    );
    if (!doesIssueExist) {
      throw new IssueNotFoundError(this.issueNotFoundErrorLanguage);
    }

    const doesIssueGroupExist =
      await this.doesIssueGroupExistRepository.doesIssueGroupExist(
        moveToIssueGroupId
      );
    if (!doesIssueGroupExist) {
      throw new IssueGroupNotFoundError(this.issueGroupNotFoundErrorLanguage);
    }

    const projectIdByIssueGroupId =
      await this.findProjectIdByIssueGroupIdRepository.findProjectIdByIssueGroupId(
        moveToIssueGroupId
      );
    const projectIdByIssueId =
      await this.findProjectIdByIssueIdRepository.findProjectIdByIssueId(
        issueId
      );
    if (projectIdByIssueGroupId !== projectIdByIssueId) {
      throw new IssueGroupBelongsToDifferentProjectError(
        this.issueGroupBelongsToDifferentProjectErrorLanguage
      );
    }

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId: projectIdByIssueId!,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("MOVE_ISSUE")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    await this.moveIssueToAnotherIssueGroupRepository.moveIssue({
      issueId,
      moveToIssueGroupId,
    });

    const shouldUpdateIssuesToCompleted =
      await this.shouldIssueGroupUpdateIssuesToCompleted.shouldIssueGroupUpdateIssues(
        moveToIssueGroupId
      );
    await this.updateIssueRepository.updateIssue({
      issueId,
      newCompleted: shouldUpdateIssuesToCompleted,
    });
  }
}
