import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { Role } from "@modules/project/entities/value-objects";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "@modules/project/use-cases/interfaces/repositories";
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
import { Issue } from "../entities";
import { CreateIssueUseCaseDTO } from "./DTOs";
import { ProjectHasntBegunError, ProjectIsArchivedError } from "./errors";
import {
  IProjectHasntBegunErrorLanguage,
  IProjectIsArchivedErrorLanguage,
} from "./interfaces/languages";
import {
  ICreateIssueRepository,
  IHasProjectBegunRepository,
  IIsProjectArchivedRepository,
} from "./interfaces/repositories";

export class CreateIssueUseCase {
  constructor(
    private readonly createIssueRepository: ICreateIssueRepository,
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly hasProjectBegunRepository: IHasProjectBegunRepository,
    private readonly isProjectArchivedRepository: IIsProjectArchivedRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly notFutureDateErrorLanguageMock: INotFutureDateErrorLanguage,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly projectHasntBegunErrorLanguage: IProjectHasntBegunErrorLanguage,
    private readonly projectIsArchivedErrorLanguage: IProjectIsArchivedErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async create({
    projectId,
    title,
    description,
    expiresAt,

    accountEmailMakingRequest,
  }: CreateIssueUseCaseDTO): Promise<string> {
    const doesProjectExist =
      await this.doesProjectExistRepository.doesProjectExist(projectId);
    if (!doesProjectExist) {
      throw new ProjectNotFoundError(
        projectId,
        this.projectNotFoundErrorLanguage
      );
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

    const hasProjectBegun =
      await this.hasProjectBegunRepository.hasProjectBegun(projectId);
    if (!hasProjectBegun) {
      throw new ProjectHasntBegunError(this.projectHasntBegunErrorLanguage);
    }

    const isProjectArchived =
      await this.isProjectArchivedRepository.isProjectArchived(projectId);
    if (isProjectArchived) {
      throw new ProjectIsArchivedError(this.projectIsArchivedErrorLanguage);
    }

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("CREATE_ISSUE")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    const issue = new Issue(
      { title, description, expiresAt, ownerEmail: accountEmailMakingRequest },
      this.notFutureDateErrorLanguageMock
    );

    await this.createIssueRepository.createIssue({
      ownerEmail: issue.ownerEmail,
      expiresAt: issue.expiresAt,
      description: issue.description,
      title: issue.title,
      issueId: issue.issueId,
      createdAt: issue.createdAt,
      projectId,
    });

    return issue.issueId;
  }
}