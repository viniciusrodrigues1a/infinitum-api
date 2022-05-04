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
import { AssignIssueToAccountUseCaseDTO } from "./DTOs";
import { IssueNotFoundError } from "./errors";
import { IIssueNotFoundErrorLanguage } from "./interfaces/languages";
import {
  IAssignIssueToAccountRepository,
  IDoesIssueExistRepository,
} from "./interfaces/repositories";

export class AssignIssueToAccountUseCase {
  constructor(
    private readonly assignIssueToAccountRepository: IAssignIssueToAccountRepository,
    private readonly findProjectIdByIssueIdRepository: IFindProjectIdByIssueIdRepository,
    private readonly doesIssueExistRepository: IDoesIssueExistRepository,
    private readonly doesParticipantExistRepository: IDoesParticipantExistRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly projectNotFoundErrorLanguage: IProjectNotFoundErrorLanguage,
    private readonly issueNotFoundErrorLanguage: IIssueNotFoundErrorLanguage,
    private readonly notParticipantInProjectErrorLanguage: INotParticipantInProjectErrorLanguage,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async assign({
    issueId,
    assignedToEmail,
    accountEmailMakingRequest,
  }: AssignIssueToAccountUseCaseDTO): Promise<void> {
    const projectId =
      await this.findProjectIdByIssueIdRepository.findProjectIdByIssueId(
        issueId
      );
    if (!projectId) {
      throw new ProjectNotFoundError(this.projectNotFoundErrorLanguage);
    }

    const doesIssueExist = await this.doesIssueExistRepository.doesIssueExist(
      issueId
    );
    if (!doesIssueExist) {
      throw new IssueNotFoundError(this.issueNotFoundErrorLanguage);
    }

    const doesAccountMakingRequestExist =
      await this.doesParticipantExistRepository.doesParticipantExist({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    if (!doesAccountMakingRequestExist) {
      throw new NotParticipantInProjectError(
        accountEmailMakingRequest,
        this.notParticipantInProjectErrorLanguage
      );
    }

    if (assignedToEmail) {
      const doesAccountBeingAssignedToIssueExist =
        await this.doesParticipantExistRepository.doesParticipantExist({
          projectId,
          accountEmail: assignedToEmail,
        });
      if (!doesAccountBeingAssignedToIssueExist) {
        throw new NotParticipantInProjectError(
          assignedToEmail,
          this.notParticipantInProjectErrorLanguage
        );
      }
    }

    const participantRole =
      await this.findParticipantRoleInProjectRepository.findParticipantRole({
        projectId,
        accountEmail: accountEmailMakingRequest,
      });
    const role = new Role(participantRole, this.invalidRoleNameErrorLanguage);
    if (!role.can("ASSIGN_ISSUE_TO_ACCOUNT")) {
      throw new RoleInsufficientPermissionError(
        participantRole,
        this.roleInsufficientPermissionErrorLanguage
      );
    }

    this.assignIssueToAccountRepository.assignIssueToAccount({
      issueId,
      assignedToEmail,
    });
  }
}
