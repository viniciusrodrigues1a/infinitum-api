import { ILanguage } from "@shared/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  AssignIssueToAccountUseCase,
  CreateIssueUseCase,
  MoveIssueToAnotherIssueGroupUseCase,
  UpdateIssueUseCase,
} from "@modules/issue/use-cases";
import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
  DeleteIssueGroupUseCase,
  DeleteProjectUseCase,
  InviteAccountToProjectUseCase,
  KickParticipantFromProjectUseCase,
  ListParticipantsInvitedToProjectUseCase,
  ListProjectsOwnedByAccountUseCase,
  RevokeInvitationUseCase,
  UpdateParticipantRoleInProjectUseCase,
  UpdateProjectUseCase,
} from "@modules/project/use-cases";
import { AcceptInvitationToProjectUseCase } from "@modules/project/use-cases/AcceptInvitationToProjectUseCase";

export interface IUseCaseFactory {
  makeFindOneAccountUseCase(language: ILanguage): FindOneAccountUseCase;
  makeCreateProjectUseCase(language: ILanguage): CreateProjectUseCase;
  makeDeleteProjectUseCase(language: ILanguage): DeleteProjectUseCase;
  makeUpdateProjectUseCase(language: ILanguage): UpdateProjectUseCase;
  makeListProjectsOwnedByAccountUseCase(): ListProjectsOwnedByAccountUseCase;
  makeCreateIssueGroupForProjectUseCase(
    language: ILanguage
  ): CreateIssueGroupForProjectUseCase;
  makeCreateIssueUseCase(language: ILanguage): CreateIssueUseCase;
  makeDeleteIssueUseCase(language: ILanguage): DeleteIssueUseCase;
  makeInviteAccountToProjectUseCase(
    language: ILanguage
  ): InviteAccountToProjectUseCase;
  makeUpdateIssueUseCase(language: ILanguage): UpdateIssueUseCase;
  makeAcceptInvitationToProjectUseCase(
    language: ILanguage
  ): AcceptInvitationToProjectUseCase;
  makeKickParticipantFromProjectUseCase(
    language: ILanguage
  ): KickParticipantFromProjectUseCase;
  makeRevokeInvitationUseCase(language: ILanguage): RevokeInvitationUseCase;
  makeUpdateParticipantRoleInProjectUseCase(
    language: ILanguage
  ): UpdateParticipantRoleInProjectUseCase;
  makeMoveIssueToAnotherIssueGroupUseCase(
    language: ILanguage
  ): MoveIssueToAnotherIssueGroupUseCase;
  makeAssignIssueToAccountUseCase(
    language: ILanguage
  ): AssignIssueToAccountUseCase;
  makeListParticipantsInvitedToProjectUseCase(
    language: ILanguage
  ): ListParticipantsInvitedToProjectUseCase;
  makeDeleteIssueGroupUseCase(language: ILanguage): DeleteIssueGroupUseCase;
}
