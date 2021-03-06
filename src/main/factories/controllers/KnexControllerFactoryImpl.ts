import {
  INotificationRepositoryFactory,
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
  mongoDBNotificationRepositoryFactoryImpl,
} from "@main/factories/repositories";
import {
  IUseCaseFactory,
  knexUseCaseFactoryImpl,
} from "@main/factories/use-cases";
import {
  FindOneAccountController,
  ListLanguagesController,
  LoginController,
  RefreshTokenController,
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
  DeleteIssueGroupController,
  DeleteProjectController,
  FindProjectImageDataURLController,
  InviteAccountToProjectController,
  KickParticipantFromProjectController,
  ListParticipantsInvitedToProjectController,
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
import {
  makeInvitationToProjectNotificationServiceComposite,
  makeKickedOutOfProjectAdminNotificationServiceComposite,
  makeKickedOutOfProjectNotificationServiceComposite,
  makeProjectDeletedNotificationServiceComposite,
} from "../notifications";
import { makeIssueAssignedNotificationServiceComposite } from "../notifications/IssueAssignedNotificationServiceCompositeFactory";
import { makeRoleUpdatedAdminNotificationServiceComposite } from "../notifications/RoleUpdatedAdminNotificationServiceCompositeFactory";
import { makeRoleUpdatedNotificationServiceComposite } from "../notifications/RoleUpdatedNotificationServiceCompositeFactory";
import {
  ControllerValidationFactory,
  controllerValidationFactory,
} from "../validation";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;
  private notificationRepositoryFactory: INotificationRepositoryFactory =
    mongoDBNotificationRepositoryFactoryImpl;
  private useCaseFactory: IUseCaseFactory = knexUseCaseFactoryImpl;
  private validationFactory: ControllerValidationFactory =
    controllerValidationFactory;

  makeRefreshTokenController(language: ILanguage): RefreshTokenController {
    return new RefreshTokenController(
      this.repositoryFactory.makeRefreshTokenRepository(),
      this.validationFactory.makeRefreshTokenControllerValidation(language)
    );
  }

  makeDeleteIssueGroupController(
    language: ILanguage
  ): DeleteIssueGroupController {
    return new DeleteIssueGroupController(
      this.useCaseFactory.makeDeleteIssueGroupUseCase(language)
    );
  }

  makeListParticipantsInvitedToProjectController(
    language: ILanguage
  ): ListParticipantsInvitedToProjectController {
    return new ListParticipantsInvitedToProjectController(
      this.useCaseFactory.makeListParticipantsInvitedToProjectUseCase(language)
    );
  }

  makeAssignIssueToAccountController(
    language: ILanguage
  ): AssignIssueToAccountController {
    return new AssignIssueToAccountController(
      this.useCaseFactory.makeAssignIssueToAccountUseCase(language),
      this.repositoryFactory.makeFindAccountEmailAssignedToIssueRepository(),
      this.validationFactory.makeAssignIssueToAccountControllerValidation(
        language
      ),
      makeIssueAssignedNotificationServiceComposite(),
      this.repositoryFactory.makeFindAccountLanguageIsoCodeRepository()
    );
  }

  makeFindOneNotificationSettingsController(
    language: ILanguage
  ): FindOneNotificationSettingsController {
    return new FindOneNotificationSettingsController(
      this.notificationRepositoryFactory.makeFindOneNotificationSettingsRepository(),
      language
    );
  }

  makeUpdateNotificationSettingsController(): UpdateNotificationSettingsController {
    return new UpdateNotificationSettingsController(
      this.notificationRepositoryFactory.makeUpdateNotificationSettingsRepository()
    );
  }

  makeMarkAllNotificationsAsReadController(): MarkAllNotificationsAsReadController {
    return new MarkAllNotificationsAsReadController(
      this.notificationRepositoryFactory.makeMarkAllAsReadNotificationRepository()
    );
  }

  makeMarkNotificationAsReadController(
    language: ILanguage
  ): MarkNotificationAsReadController {
    return new MarkNotificationAsReadController(
      this.notificationRepositoryFactory.makeMarkAsReadNotificationRepository(),
      this.notificationRepositoryFactory.makeFindOneNotificationRepository(),
      this.notificationRepositoryFactory.makeDoesNotificationBelongToAccountEmail(),
      language,
      language
    );
  }

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
      this.repositoryFactory.makeFindProjectImageDataURLRepository()
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
      this.repositoryFactory.makeFindAllEmailsOfOwnersAndAdminsOfProjectRepository(),
      this.validationFactory.makeUpdateParticipantRoleInProjectControllerValidation(
        language
      ),
      makeRoleUpdatedNotificationServiceComposite(),
      makeRoleUpdatedAdminNotificationServiceComposite(),
      this.repositoryFactory.makeFindAccountLanguageIsoCodeRepository()
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
      this.repositoryFactory.makeFindAllEmailsOfOwnersAndAdminsOfProjectRepository(),
      this.validationFactory.makeKickParticipantFromProjectControllerValidation(
        language
      ),
      makeKickedOutOfProjectNotificationServiceComposite(),
      makeKickedOutOfProjectAdminNotificationServiceComposite(),
      this.repositoryFactory.makeFindAccountLanguageIsoCodeRepository()
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
      ),
      makeInvitationToProjectNotificationServiceComposite(),
      this.repositoryFactory.makeFindAccountLanguageIsoCodeRepository()
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
      this.useCaseFactory.makeDeleteProjectUseCase(language),
      this.repositoryFactory.makeFindProjectNameByProjectIdRepository(),
      this.repositoryFactory.makeFindAllEmailsParticipantInProjectRepository(),
      makeProjectDeletedNotificationServiceComposite(),
      this.repositoryFactory.makeFindAccountLanguageIsoCodeRepository()
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
      this.repositoryFactory.makeFindAccountImageDataURLRepository(),
      this.repositoryFactory.makeFindAccountLanguageIdRepository()
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
