import { FindOneAccountController } from "@modules/account/presentation/controllers/FindOneAccountController";
import { LoginController } from "@modules/account/presentation/controllers/LoginController";
import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { ILanguage } from "@shared/presentation/languages";
import {
  CreateIssueController,
  DeleteIssueController,
  MoveIssueToAnotherIssueGroupController,
  OverviewMetricsController,
  UpdateIssueController,
} from "@modules/issue/presentation/controllers";
import {
  AcceptInvitationToProjectController,
  CreateProjectController,
  DeleteProjectController,
  FindProjectImageDataURLController,
  ListProjectsOwnedByAccountController,
  RevokeInvitationController,
  UpdateIssueGroupColorController,
  UpdateParticipantRoleInProjectController,
  UpdateProjectController,
  UpdateProjectImageController,
} from "@modules/project/presentation/controllers";
import { CreateIssueGroupForProjectController } from "@modules/project/presentation/controllers/CreateIssueGroupForProjectController";
import { InviteAccountToProjectController } from "@modules/project/presentation/controllers/InviteAccountToProjectController";
import UpdateIssueGroupFinalStatusController from "@modules/project/presentation/controllers/UpdateIssueGroupFinalStatusController";

export interface IControllerFactory {
  makeRegisterController(language: ILanguage): RegisterController;
  makeLoginController(language: ILanguage): LoginController;
  makeFindOneAccountController(language: ILanguage): FindOneAccountController;
  makeCreateProjectController(language: ILanguage): CreateProjectController;
  makeDeleteProjectController(language: ILanguage): DeleteProjectController;
  makeUpdateProjectController(language: ILanguage): UpdateProjectController;
  makeListProjectsOwnedByAccountController(): ListProjectsOwnedByAccountController;
  makeCreateIssueGroupForProjectController(
    language: ILanguage
  ): CreateIssueGroupForProjectController;
  makeCreateIssueController(language: ILanguage): CreateIssueController;
  makeDeleteIssueController(language: ILanguage): DeleteIssueController;
  makeInviteAccountToProjectUseCase(
    language: ILanguage
  ): InviteAccountToProjectController;
  makeUpdateIssueController(language: ILanguage): UpdateIssueController;
  makeAcceptInvitationToProjectController(
    language: ILanguage
  ): AcceptInvitationToProjectController;
  makeRevokeInvitationController(
    language: ILanguage
  ): RevokeInvitationController;
  makeUpdateParticipantRoleInProjectController(
    language: ILanguage
  ): UpdateParticipantRoleInProjectController;
  makeOverviewMetricsController(language: ILanguage): OverviewMetricsController;
  makeUpdateProjectImageController(): UpdateProjectImageController;
  makeFindProjectImageDataURLController(): FindProjectImageDataURLController;
  makeMoveIssueToAnotherIssueGroupController(
    language: ILanguage
  ): MoveIssueToAnotherIssueGroupController;
  makeUpdateIssueGroupFinalStatusController(): UpdateIssueGroupFinalStatusController;
  makeUpdateIssueGroupColorController(): UpdateIssueGroupColorController;
}
