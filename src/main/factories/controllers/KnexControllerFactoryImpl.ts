import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
} from "@main/factories/repositories";
import {
  IUseCaseFactory,
  knexUseCaseFactoryImpl,
} from "@main/factories/use-cases";
import {
  FindOneAccountController,
  ListLanguagesController,
  LoginController,
  RegisterController,
  UpdateAccountController,
} from "@modules/account/presentation/controllers";
import {
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
  KickParticipantFromProjectController,
  ListProjectsOwnedByAccountController,
  RevokeInvitationController,
  UpdateIssueGroupColorController,
  UpdateIssueGroupFinalStatusController,
  UpdateParticipantRoleInProjectController,
  UpdateProjectController,
  UpdateProjectImageController,
} from "@modules/project/presentation/controllers";
import { ILanguage } from "@shared/presentation/languages";
import {
  ControllerValidationFactory,
  controllerValidationFactory,
} from "../validation";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;
  private useCaseFactory: IUseCaseFactory = knexUseCaseFactoryImpl;
  private validationFactory: ControllerValidationFactory =
    controllerValidationFactory;

  makeListLanguagesController(): ListLanguagesController {
    return new ListLanguagesController(
      this.repositoryFactory.makeListLanguagesRepository()
    );
  }

  makeUpdateAccountController(language: ILanguage): UpdateAccountController {
    return new UpdateAccountController(
      this.repositoryFactory.makeUpdateAccountRepository(),
      this.repositoryFactory.makeUpdateAccountImageRepository(),
      this.repositoryFactory.makeDoesAccountExistRepository(),
      language
    );
  }

  makeUpdateIssueGroupColorController(): UpdateIssueGroupColorController {
    return new UpdateIssueGroupColorController(
      this.repositoryFactory.makeUpdateIssueGroupColorRepository()
    );
  }

  makeUpdateIssueGroupFinalStatusController(
    language: ILanguage
  ): UpdateIssueGroupFinalStatusController {
    return new UpdateIssueGroupFinalStatusController(
      this.repositoryFactory.makeUpdateIssueGroupFinalStatusRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueGroupIdRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language
    );
  }

  makeMoveIssueToAnotherIssueGroupController(
    language: ILanguage
  ): MoveIssueToAnotherIssueGroupController {
    return new MoveIssueToAnotherIssueGroupController(
      this.useCaseFactory.makeMoveIssueToAnotherIssueGroupUseCase(language),
      this.validationFactory.makeMoveIssueToAnotherIssueGroupControllerValidation(
        language
      )
    );
  }

  makeFindProjectImageDataURLController(): FindProjectImageDataURLController {
    return new FindProjectImageDataURLController(
      this.repositoryFactory.makeFindProjectImageBufferRepository()
    );
  }

  makeUpdateProjectImageController(): UpdateProjectImageController {
    return new UpdateProjectImageController(
      this.repositoryFactory.makeUpdateProjectImageRepository()
    );
  }

  makeOverviewMetricsController(
    language: ILanguage
  ): OverviewMetricsController {
    return new OverviewMetricsController(
      this.repositoryFactory.makeReportExpiredIssuesMetricsRepository(),
      this.repositoryFactory.makeReportIssuesForTodayMetricsRepository(),
      this.repositoryFactory.makeReportAllIssuesMetricsRepository(),
      this.repositoryFactory.makeReportIssuesWeeklyOverviewMetricsRepository(),
      this.repositoryFactory.makeReportIssuesMonthlyOverviewMetricsRepository(),
      language
    );
  }

  makeUpdateParticipantRoleInProjectController(
    language: ILanguage
  ): UpdateParticipantRoleInProjectController {
    return new UpdateParticipantRoleInProjectController(
      this.useCaseFactory.makeUpdateParticipantRoleInProjectUseCase(language),
      this.validationFactory.makeUpdateParticipantRoleInProjectControllerValidation(
        language
      )
    );
  }

  makeRevokeInvitationController(
    language: ILanguage
  ): RevokeInvitationController {
    return new RevokeInvitationController(
      this.useCaseFactory.makeRevokeInvitationUseCase(language),
      this.validationFactory.makeRevokeInvitationControllerValidation(language)
    );
  }

  makeKickParticipantFromProjectController(
    language: ILanguage
  ): KickParticipantFromProjectController {
    return new KickParticipantFromProjectController(
      this.useCaseFactory.makeKickParticipantFromProjectUseCase(language),
      this.validationFactory.makeKickParticipantFromProjectControllerValidation(
        language
      )
    );
  }

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
      this.repositoryFactory.makeUpdateIssueGroupColorRepository(),
      this.validationFactory.makeCreateProjectControllerValidation(language),
      language
    );
  }

  makeFindOneAccountController(language: ILanguage): FindOneAccountController {
    return new FindOneAccountController(
      this.useCaseFactory.makeFindOneAccountUseCase(language),
      this.repositoryFactory.makeFindAccountImageDataURLRepository()
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
