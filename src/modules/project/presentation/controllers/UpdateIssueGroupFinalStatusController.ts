import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { Role } from "@modules/project/entities/value-objects";
import {
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueGroupIdRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import {
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors";
import { IRoleInsufficientPermissionErrorLanguage } from "@shared/use-cases/interfaces/languages";
import { IUpdateIssueGroupFinalStatusRepository } from "../interfaces/repositories";

export type UpdateIssueGroupControllerRequest = AccountMakingRequestDTO & {
  issueGroupId: string;
  newIsFinal: boolean;
};

export default class UpdateIssueGroupFinalStatusController
  implements IController
{
  constructor(
    private readonly updateIssueGroupFinalStatusRepository: IUpdateIssueGroupFinalStatusRepository,
    private readonly findProjectIdByIssueGroupIdRepository: IFindProjectIdByIssueGroupIdRepository,
    private readonly findParticipantRoleInProjectRepository: IFindParticipantRoleInProjectRepository,
    private readonly invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage,
    private readonly roleInsufficientPermissionErrorLanguage: IRoleInsufficientPermissionErrorLanguage
  ) {}

  async handleRequest({
    issueGroupId,
    newIsFinal,
    accountEmailMakingRequest,
  }: UpdateIssueGroupControllerRequest): Promise<HttpResponse> {
    try {
      await this.updateIssueGroupFinalStatusRepository.updateIssueGroupFinalStatus(
        {
          issueGroupId,
          newIsFinal,
        }
      );

      const projectId =
        await this.findProjectIdByIssueGroupIdRepository.findProjectIdByIssueGroupId(
          issueGroupId
        );

      if (!projectId) throw new Error("Project not found");

      const participantRoleName =
        await this.findParticipantRoleInProjectRepository.findParticipantRole({
          projectId,
          accountEmail: accountEmailMakingRequest,
        });
      const role = new Role(
        participantRoleName,
        this.invalidRoleNameErrorLanguage
      );
      if (!role.can("UPDATE_PROJECT"))
        throw new RoleInsufficientPermissionError(
          participantRoleName,
          this.roleInsufficientPermissionErrorLanguage
        );

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
