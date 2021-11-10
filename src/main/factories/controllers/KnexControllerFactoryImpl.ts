import { FindOneAccountController } from "@modules/account/presentation/controllers/FindOneAccountController";
import { LoginController } from "@modules/account/presentation/controllers/LoginController";
import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { ILanguage } from "@modules/account/presentation/languages";
import {
  AcceptInvitationToProjectController,
  CreateIssueGroupForProjectController,
  CreateProjectController,
  DeleteProjectController,
  InviteAccountToProjectController,
  ListProjectsOwnedByAccountController,
  UpdateProjectController,
} from "@modules/project/presentation/controllers";
import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
} from "@main/factories/repositories";
import {
  IUseCaseFactory,
  knexUseCaseFactoryImpl,
} from "@main/factories/use-cases";
import {
  CreateIssueController,
  DeleteIssueController,
  UpdateIssueController,
} from "@modules/issue/presentation/controllers";
import { IControllerFactory } from "./IControllerFactory";
import { ControllerValidationFactory } from "../validation";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;
  private useCaseFactory: IUseCaseFactory = knexUseCaseFactoryImpl;
  private validationFactory: ControllerValidationFactory =
    new ControllerValidationFactory();

  makeAcceptInvitationToProjectController(
    language: ILanguage
  ): AcceptInvitationToProjectController {
    return new AcceptInvitationToProjectController(
      this.useCaseFactory.makeAcceptInvitationToProjectUseCase(language)
    );
  }

  makeUpdateIssueController(language: ILanguage): UpdateIssueController {
    return new UpdateIssueController(
      this.useCaseFactory.makeUpdateIssueUseCase(language),
      this.validationFactory.makeUpdateIssueControllerValidation(language)
    );
  }

  makeInviteAccountToProjectUseCase(
    language: ILanguage
  ): InviteAccountToProjectController {
    return new InviteAccountToProjectController(
      this.useCaseFactory.makeInviteAccountToProjectUseCase(language),
      this.validationFactory.makeInviteAccountToProjectControllerValidation(
        language
      )
    );
  }

  makeDeleteIssueController(language: ILanguage): DeleteIssueController {
    return new DeleteIssueController(
      this.useCaseFactory.makeDeleteIssueUseCase(language)
    );
  }

  makeCreateIssueController(language: ILanguage): CreateIssueController {
    return new CreateIssueController(
      this.useCaseFactory.makeCreateIssueUseCase(language),
      this.validationFactory.makeCreateIssueControllerValidation(language)
    );
  }

  makeCreateIssueGroupForProjectController(
    language: ILanguage
  ): CreateIssueGroupForProjectController {
    return new CreateIssueGroupForProjectController(
      this.useCaseFactory.makeCreateIssueGroupForProjectUseCase(language),
      this.validationFactory.makeCreateIssueGroupForProjectControllerValidation(
        language
      )
    );
  }

  makeListProjectsOwnedByAccountController(): ListProjectsOwnedByAccountController {
    return new ListProjectsOwnedByAccountController(
      this.useCaseFactory.makeListProjectsOwnedByAccountUseCase()
    );
  }

  makeUpdateProjectController(language: ILanguage): UpdateProjectController {
    return new UpdateProjectController(
      this.useCaseFactory.makeUpdateProjectUseCase(language),
      this.validationFactory.makeUpdateProjectControllerValidation(language)
    );
  }

  makeDeleteProjectController(language: ILanguage): DeleteProjectController {
    return new DeleteProjectController(
      this.useCaseFactory.makeDeleteProjectUseCase(language)
    );
  }

  makeCreateProjectController(language: ILanguage): CreateProjectController {
    return new CreateProjectController(
      this.useCaseFactory.makeCreateProjectUseCase(language),
      this.useCaseFactory.makeCreateIssueGroupForProjectUseCase(language),
      this.validationFactory.makeCreateProjectControllerValidation(language)
    );
  }

  makeFindOneAccountController(language: ILanguage): FindOneAccountController {
    return new FindOneAccountController(
      this.useCaseFactory.makeFindOneAccountUseCase(language)
    );
  }

  makeLoginController(language: ILanguage): LoginController {
    return new LoginController(
      this.repositoryFactory.makeLoginRepository(language),
      this.validationFactory.makeLoginControllerValidation(language)
    );
  }

  makeRegisterController(language: ILanguage): RegisterController {
    return new RegisterController(
      this.repositoryFactory.makeRegisterRepository(language),
      this.validationFactory.makeRegisterControllerValidation(language)
    );
  }
}

export const knexControllerFactoryImpl = new KnexControllerFactoryImpl();
