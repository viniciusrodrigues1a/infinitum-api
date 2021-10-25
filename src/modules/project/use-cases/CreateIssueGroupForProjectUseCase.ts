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
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import { IssueGroup, Role } from "../entities/value-objects";
import { CreateIssueGroupForProjectUseCaseDTO } from "./DTOs";
import {
  ICreateIssueGroupForProjectRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";

export class CreateIssueGroupForProjectUseCase {
  constructor(
    private readonly doesProjectExistRepository: IDoesProjectExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly createIssueGroupForProjectRepository: ICreateIssueGroupForProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async create({
    title,
    projectId,
    accountEmailMakingRequest,
  }: CreateIssueGroupForProjectUseCaseDTO): Promise<string> {
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

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("CREATE_ISSUE_GROUP")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    const issueGroup = new IssueGroup({ title, issues: [] });
    await this.createIssueGroupForProjectRepository.createIssueGroup({
      ...issueGroup,
      projectId,
    });

    return issueGroup.issueGroupId;
  }
}
