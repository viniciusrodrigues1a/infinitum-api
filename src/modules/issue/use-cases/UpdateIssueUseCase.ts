import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { Role } from "@modules/project/entities/value-objects";
import {
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueIdRepository,
} from "@modules/project/use-cases/interfaces/repositories";
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
import { Issue } from "../entities";
import { UpdateIssueUseCaseDTO } from "./DTOs";
import { IssueNotFoundError } from "./errors";
import { IIssueNotFoundErrorLanguage } from "./interfaces/languages";
import {
  IFindOneIssueRepository,
  IUpdateIssueRepository,
} from "./interfaces/repositories";

export class UpdateIssueUseCase {
  constructor(
    private readonly updateIssueRepository: IUpdateIssueRepository,
    private readonly findOneIssueRepository: IFindOneIssueRepository,
    private readonly findProjectIdByIssueIdRepository: IFindProjectIdByIssueIdRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly issueNotFoundErrorLanguage: IIssueNotFoundErrorLanguage,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async update({
    issueId,
    accountEmailMakingRequest,
    newTitle,
    newExpiresAt,
    newDescription,
    newCompleted,
  }: UpdateIssueUseCaseDTO): Promise<void> {
    const oldIssue = await this.findOneIssueRepository.findOneIssue(issueId);
    if (!oldIssue) {
      throw new IssueNotFoundError(this.issueNotFoundErrorLanguage);
    }

    const projectId =
      await this.findProjectIdByIssueIdRepository.findProjectIdByIssueId(
        issueId
      );
    if (!projectId) {
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
    if (!role.can("UPDATE_ISSUE")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    const newIssue = new Issue({
      title: newTitle || oldIssue.title,
      description: newDescription || oldIssue.description,
      expiresAt: newExpiresAt === undefined ? oldIssue.expiresAt : newExpiresAt,
      completed: newCompleted || oldIssue.completed,
      assignedToEmail: oldIssue.assignedToEmail,
    });

    await this.updateIssueRepository.updateIssue({
      issueId,
      newTitle: newIssue.title,
      newDescription: newIssue.description,
      newExpiresAt: newIssue.expiresAt,
      newCompleted: newIssue.completed,
    });
  }
}
