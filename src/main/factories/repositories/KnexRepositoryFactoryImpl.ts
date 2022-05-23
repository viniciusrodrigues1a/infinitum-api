import {
  KnexAccountRepository,
  KnexLoginRepository,
  KnexRegisterRepository,
} from "@modules/account/infra/repositories";
import { KnexRefreshTokenRepository } from "@modules/account/infra/repositories/KnexRefreshTokenRepository";
import {
  IFindAccountImageDataURLRepository,
  IFindAccountLanguageIdRepository,
  IListLanguagesRepository,
  ILoginRepository,
  IRefreshTokenRepository,
  IRegisterRepository,
  IUpdateAccountImageRepository,
  IUpdateAccountRepository,
} from "@modules/account/presentation/interfaces/repositories";
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { IFindIssueTitleByIssueIdRepository } from "@modules/issue/infra/notifications/interfaces/repositories";
import { KnexIssueRepository } from "@modules/issue/infra/repositories";
import {
  IFindAccountEmailAssignedToIssueRepository,
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesMonthlyOverviewMetricsRepository,
  IReportIssuesWeeklyOverviewMetricsRepository,
} from "@modules/issue/presentation/interfaces/repositories";
import {
  IAssignIssueToAccountRepository,
  ICreateIssueRepository,
  IDeleteIssueRepository,
  IDoesIssueExistRepository,
  IDoesIssueGroupExistRepository,
  IFindOneIssueRepository,
  IMoveIssueToAnotherIssueGroupRepository,
  IShouldIssueGroupUpdateIssuesToCompletedRepository,
  IUpdateIssueRepository,
} from "@modules/issue/use-cases/interfaces/repositories";
import { KnexProjectRepository } from "@modules/project/infra/repositories";
import {
  IFindOneProjectIdByInvitationTokenRepository,
  IFindOneProjectRepository,
} from "@modules/project/infra/repositories/interfaces";
import {
  IFindAllEmailsOfOwnersAndAdminsOfProjectRepository,
  IFindAllEmailsParticipantInProject,
  IFindProjectImageDataURLRepository,
  IFindProjectNameByProjectIdRepository,
  IUpdateIssueGroupColorRepository,
  IUpdateIssueGroupFinalStatusRepository,
  IUpdateProjectImageRepository,
} from "@modules/project/presentation/interfaces/repositories";
import {
  IAcceptInvitationTokenRepository,
  ICreateInvitationTokenRepository,
  ICreateIssueGroupForProjectRepository,
  ICreateProjectRepository,
  IDeleteIssueGroupRepository,
  IDeleteProjectRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindOneAccountEmailByInvitationTokenRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueGroupIdRepository,
  IFindProjectIdByIssueIdRepository,
  IFindStartDateByProjectIdRepository,
  IHasAccountBeenInvitedToProjectRepository,
  IHasProjectBegunRepository,
  IIsInvitationTokenValidRepository,
  IIsProjectArchivedRepository,
  IKickParticipantFromProjectRepository,
  IListParticipantsInvitedToProjectRepository,
  IListProjectsOwnedByAccountRepository,
  IRevokeInvitationRepository,
  IUpdateParticipantRoleInProjectRepository,
  IUpdateProjectRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import {
  IFindAccountLanguageIsoCodeRepository,
  IFindOneAccountIdByEmailRepository,
} from "@shared/infra/notifications/interfaces";
import { ILanguage } from "@shared/presentation/languages";
import { INotificationRepositoryFactory } from "./INotificationRepositoryFactory";
import { IRepositoryFactory } from "./IRepositoryFactory";
import { mongoDBNotificationRepositoryFactoryImpl } from "./MongoDBNotificationRepositoryFactoryImpl";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  private notificationRepository: INotificationRepositoryFactory =
    mongoDBNotificationRepositoryFactoryImpl;

  makeRefreshTokenRepository(): IRefreshTokenRepository {
    return new KnexRefreshTokenRepository();
  }

  makeFindAccountLanguageIsoCodeRepository(): IFindAccountLanguageIsoCodeRepository {
    return this.makeAccountRepository();
  }

  makeDeleteIssueGroupRepository(): IDeleteIssueGroupRepository {
    return this.makeProjectRepository();
  }

  makeFindOneProjectIdByInvitationTokenRepository(): IFindOneProjectIdByInvitationTokenRepository {
    return this.makeProjectRepository();
  }

  makeFindOneProjectRepository(): IFindOneProjectRepository {
    return this.makeProjectRepository();
  }

  makeListParticipantsInvitedToProjectRepository(): IListParticipantsInvitedToProjectRepository {
    return this.makeProjectRepository();
  }

  makeFindAllEmailsOfOwnersAndAdminsOfProjectRepository(): IFindAllEmailsOfOwnersAndAdminsOfProjectRepository {
    return this.makeProjectRepository();
  }

  makeFindAllEmailsParticipantInProjectRepository(): IFindAllEmailsParticipantInProject {
    return this.makeProjectRepository();
  }

  makeFindAccountEmailAssignedToIssueRepository(): IFindAccountEmailAssignedToIssueRepository {
    return this.makeIssueRepository();
  }

  makeFindIssueTitleByProjectIdRepository(): IFindIssueTitleByIssueIdRepository {
    return this.makeIssueRepository();
  }

  makeAssignIssueToAccountRepository(): IAssignIssueToAccountRepository {
    return this.makeIssueRepository();
  }

  makeFindOneAccountIdByEmailRepository(): IFindOneAccountIdByEmailRepository {
    return this.makeAccountRepository();
  }

  makeFindAccountLanguageIdRepository(): IFindAccountLanguageIdRepository {
    return this.makeAccountRepository();
  }

  makeFindAccountImageDataURLRepository(): IFindAccountImageDataURLRepository {
    return this.makeAccountRepository();
  }

  makeListLanguagesRepository(): IListLanguagesRepository {
    return this.makeAccountRepository();
  }

  makeUpdateAccountImageRepository(): IUpdateAccountImageRepository {
    return this.makeAccountRepository();
  }

  makeUpdateAccountRepository(): IUpdateAccountRepository {
    return this.makeAccountRepository();
  }

  makeUpdateIssueGroupColorRepository(): IUpdateIssueGroupColorRepository {
    return this.makeProjectRepository();
  }

  makeUpdateIssueGroupFinalStatusRepository(): IUpdateIssueGroupFinalStatusRepository {
    return this.makeProjectRepository();
  }

  makeFindProjectImageDataURLRepository(): IFindProjectImageDataURLRepository {
    return this.makeProjectRepository();
  }

  makeUpdateProjectImageRepository(): IUpdateProjectImageRepository {
    return this.makeProjectRepository();
  }

  makeReportIssuesWeeklyOverviewMetricsRepository(): IReportIssuesWeeklyOverviewMetricsRepository {
    return this.makeIssueRepository();
  }

  makeReportIssuesMonthlyOverviewMetricsRepository(): IReportIssuesMonthlyOverviewMetricsRepository {
    return this.makeIssueRepository();
  }

  makeReportExpiredIssuesMetricsRepository(): IReportExpiredIssuesMetricsRepository {
    return this.makeIssueRepository();
  }

  makeReportAllIssuesMetricsRepository(): IReportAllIssuesMetricsRepository {
    return this.makeIssueRepository();
  }

  makeReportIssuesForTodayMetricsRepository(): IReportIssuesForTodayMetricsRepository {
    return this.makeIssueRepository();
  }

  makeMoveIssueToAnotherIssueGroupRepository(): IMoveIssueToAnotherIssueGroupRepository {
    return this.makeIssueRepository();
  }

  makeDoesIssueExistRepository(): IDoesIssueExistRepository {
    return this.makeIssueRepository();
  }

  makeDoesIssueGroupExistRepository(): IDoesIssueGroupExistRepository {
    return this.makeIssueRepository();
  }

  makeFindProjectIdByIssueGroupIdRepository(): IFindProjectIdByIssueGroupIdRepository {
    return this.makeProjectRepository();
  }

  makeFindProjectIdByIssueIdRepository(): IFindProjectIdByIssueIdRepository {
    return this.makeProjectRepository();
  }

  makeFindParticipantRoleInProjectRepository(): IFindParticipantRoleInProjectRepository {
    return this.makeProjectRepository();
  }

  makeShouldIssueGroupUpdateIssuesToCompletedRepository(): IShouldIssueGroupUpdateIssuesToCompletedRepository {
    return this.makeIssueRepository();
  }

  makeUpdateIssueRepository(): IUpdateIssueRepository {
    return this.makeIssueRepository();
  }

  makeUpdateParticipantRoleInProjectRepository(): IUpdateParticipantRoleInProjectRepository {
    return this.makeProjectRepository();
  }

  makeDoesProjectExistRepository(): IDoesProjectExistRepository {
    return this.makeProjectRepository();
  }

  makeDoesParticipantExistRepository(): IDoesParticipantExistRepository {
    return this.makeProjectRepository();
  }

  makeRevokeInvitationRepository(): IRevokeInvitationRepository {
    return this.makeProjectRepository();
  }

  makeKickParticipantFromProjectRepository(): IKickParticipantFromProjectRepository {
    return this.makeProjectRepository();
  }

  makeAcceptInvitationTokenRepository(): IAcceptInvitationTokenRepository {
    return this.makeProjectRepository();
  }

  makeIsInvitationTokenValidRepository(): IIsInvitationTokenValidRepository {
    return this.makeProjectRepository();
  }

  makeFindOneAccountEmailByInvitationTokenRepository(): IFindOneAccountEmailByInvitationTokenRepository {
    return this.makeProjectRepository();
  }

  makeFindOneIssueRepository(): IFindOneIssueRepository {
    return this.makeIssueRepository();
  }

  makeCreateInvitationTokenRepository(): ICreateInvitationTokenRepository {
    return this.makeProjectRepository();
  }

  makeHasAccountBeenInvitedToProjectRepository(): IHasAccountBeenInvitedToProjectRepository {
    return this.makeProjectRepository();
  }

  makeFindProjectNameByProjectIdRepository(): IFindProjectNameByProjectIdRepository {
    return this.makeProjectRepository();
  }

  makeDeleteIssueRepository(): IDeleteIssueRepository {
    return this.makeIssueRepository();
  }

  makeCreateIssueRepository(): ICreateIssueRepository {
    return this.makeIssueRepository();
  }

  makeHasProjectBegunRepository(): IHasProjectBegunRepository {
    return this.makeProjectRepository();
  }

  makeFindStartDateByProjectIdRepository(): IFindStartDateByProjectIdRepository {
    return this.makeProjectRepository();
  }

  makeIsProjectArchivedRepository(): IIsProjectArchivedRepository {
    return this.makeProjectRepository();
  }

  makeCreateIssueGroupForProjectRepository(): ICreateIssueGroupForProjectRepository {
    return this.makeProjectRepository();
  }

  makeListProjectsOwnedByAccountRepository(): IListProjectsOwnedByAccountRepository {
    return this.makeProjectRepository();
  }

  makeUpdateProjectRepository(): IUpdateProjectRepository {
    return this.makeProjectRepository();
  }

  makeDeleteProjectRepository(): IDeleteProjectRepository {
    return this.makeProjectRepository();
  }

  makeCreateProjectRepository(): ICreateProjectRepository {
    return this.makeProjectRepository();
  }

  makeFindOneAccountRepository(): IFindOneAccountRepository {
    return this.makeAccountRepository();
  }

  makeDoesAccountExistRepository(): IDoesAccountExistRepository {
    return this.makeAccountRepository();
  }

  makeLoginRepository(language: ILanguage): ILoginRepository {
    return new KnexLoginRepository(
      this.makeFindOneAccountRepository(),
      language
    );
  }

  makeRegisterRepository(language: ILanguage): IRegisterRepository {
    return new KnexRegisterRepository(
      this.makeDoesAccountExistRepository(),
      this.notificationRepository.makeCreateNotificationSettingsRepository(),
      language,
      language
    );
  }

  private makeAccountRepository(): KnexAccountRepository {
    return new KnexAccountRepository();
  }

  private makeProjectRepository(): KnexProjectRepository {
    return new KnexProjectRepository();
  }

  private makeIssueRepository(): KnexIssueRepository {
    return new KnexIssueRepository();
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
