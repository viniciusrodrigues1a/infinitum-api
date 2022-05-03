import {
  FindOneAccountController,
  ListLanguagesController,
  LoginController,
  RegisterController,
  UpdateAccountController,
} from "@modules/account/presentation/controllers";
import {
  AssignIssueToAccountController,
  CreateIssueController,
  DeleteIssueController,
  MoveIssueToAnotherIssueGroupController,
  OverviewMetricsController,
  UpdateIssueController,
} from "@modules/issue/presentation/controllers";
import {
  AcceptInvitationToProjectController,
  CreateIssueGroupForProjectController,
  CreateProjectController,
  DeleteProjectController,
  FindProjectImageDataURLController,
  InviteAccountToProjectController,
  ListProjectsOwnedByAccountController,
  RevokeInvitationController,
  UpdateIssueGroupColorController,
  UpdateIssueGroupFinalStatusController,
  UpdateParticipantRoleInProjectController,
  UpdateProjectController,
  UpdateProjectImageController,
} from "@modules/project/presentation/controllers";
import {
  FindOneNotificationSettingsController,
  MarkAllNotificationsAsReadController,
  MarkNotificationAsReadController,
  UpdateNotificationSettingsController,
} from "@shared/presentation/controllers";
import { ILanguage } from "@shared/presentation/languages";

export interface IControllerFactory {
  makeRegisterController(language: ILanguage): RegisterController;
  makeLoginController(language: ILanguage): LoginController;
  makeUpdateAccountController(language: ILanguage): UpdateAccountController;
  makeListLanguagesController(): ListLanguagesController;
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
  makeUpdateIssueGroupFinalStatusController(
    language: ILanguage
  ): UpdateIssueGroupFinalStatusController;
  makeUpdateIssueGroupColorController(): UpdateIssueGroupColorController;
  makeMarkNotificationAsReadController(
    language: ILanguage
  ): MarkNotificationAsReadController;
  makeMarkAllNotificationsAsReadController(): MarkAllNotificationsAsReadController;
  makeUpdateNotificationSettingsController(): UpdateNotificationSettingsController;
  makeFindOneNotificationSettingsController(
    language: ILanguage
  ): FindOneNotificationSettingsController;
  makeAssignIssueToAccountController(
    language: ILanguage
  ): AssignIssueToAccountController;
}
