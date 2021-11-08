import { FindOneAccountController } from "@modules/account/presentation/controllers/FindOneAccountController";
import { LoginController } from "@modules/account/presentation/controllers/LoginController";
import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { ILanguage } from "@modules/account/presentation/languages";
import {
  CreateIssueController,
  DeleteIssueController,
  UpdateIssueController,
} from "@modules/issue/presentation/controllers";
import {
  CreateProjectController,
  DeleteProjectController,
  ListProjectsOwnedByAccountController,
  UpdateProjectController,
} from "@modules/project/presentation/controllers";
import { CreateIssueGroupForProjectController } from "@modules/project/presentation/controllers/CreateIssueGroupForProjectController";
import { InviteAccountToProjectController } from "@modules/project/presentation/controllers/InviteAccountToProjectController";

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
}
