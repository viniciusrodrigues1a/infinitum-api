import {
  IFindAccountImageDataURLRepository,
  IFindAccountLanguageIdRepository,
  IListLanguagesRepository,
  ILoginRepository,
  IRegisterRepository,
  IUpdateAccountImageRepository,
  IUpdateAccountRepository,
} from "@modules/account/presentation/interfaces/repositories";
import { ILanguage } from "@shared/presentation/languages";
import {
  IFindOneAccountRepository,
  IDoesAccountExistRepository,
} from "@modules/account/use-cases/interfaces/repositories";
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
import {
  IFindProjectImageDataURLRepository,
  IUpdateIssueGroupColorRepository,
  IUpdateIssueGroupFinalStatusRepository,
  IUpdateProjectImageRepository,
  IFindProjectNameByProjectIdRepository,
  IFindAllEmailsParticipantInProject,
  IFindAllEmailsOfOwnersAndAdminsOfProjectRepository,
} from "@modules/project/presentation/interfaces/repositories";
import {
  IAcceptInvitationTokenRepository,
  ICreateInvitationTokenRepository,
  ICreateIssueGroupForProjectRepository,
  ICreateProjectRepository,
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
import { IFindOneAccountIdByEmailRepository } from "@shared/infra/notifications/interfaces";
import { IFindIssueTitleByIssueIdRepository } from "@modules/issue/infra/notifications/interfaces/repositories";
import {
  IFindOneProjectIdByInvitationTokenRepository,
  IFindOneProjectRepository,
} from "@modules/project/infra/repositories/interfaces";

export interface IRepositoryFactory {
  makeRegisterRepository(language: ILanguage): IRegisterRepository;
  makeLoginRepository(language: ILanguage): ILoginRepository;
  makeUpdateAccountRepository(): IUpdateAccountRepository;
  makeUpdateAccountImageRepository(): IUpdateAccountImageRepository;
  makeListLanguagesRepository(): IListLanguagesRepository;
  makeFindAccountImageDataURLRepository(): IFindAccountImageDataURLRepository;
  makeFindAccountLanguageIdRepository(): IFindAccountLanguageIdRepository;
  makeDoesAccountExistRepository(): IDoesAccountExistRepository;
  makeFindOneAccountRepository(): IFindOneAccountRepository;
  makeCreateProjectRepository(): ICreateProjectRepository;
  makeMoveIssueToAnotherIssueGroupRepository(): IMoveIssueToAnotherIssueGroupRepository;
  makeDoesIssueExistRepository(): IDoesIssueExistRepository;
  makeDoesIssueGroupExistRepository(): IDoesIssueGroupExistRepository;
  makeFindProjectIdByIssueGroupIdRepository(): IFindProjectIdByIssueGroupIdRepository;
  makeFindProjectIdByIssueIdRepository(): IFindProjectIdByIssueIdRepository;
  makeFindParticipantRoleInProjectRepository(): IFindParticipantRoleInProjectRepository;
  makeShouldIssueGroupUpdateIssuesToCompletedRepository(): IShouldIssueGroupUpdateIssuesToCompletedRepository;
  makeUpdateIssueRepository(): IUpdateIssueRepository;
  makeUpdateParticipantRoleInProjectRepository(): IUpdateParticipantRoleInProjectRepository;
  makeDoesProjectExistRepository(): IDoesProjectExistRepository;
  makeDoesParticipantExistRepository(): IDoesParticipantExistRepository;
  makeRevokeInvitationRepository(): IRevokeInvitationRepository;
  makeKickParticipantFromProjectRepository(): IKickParticipantFromProjectRepository;
  makeAcceptInvitationTokenRepository(): IAcceptInvitationTokenRepository;
  makeIsInvitationTokenValidRepository(): IIsInvitationTokenValidRepository;
  makeFindOneAccountEmailByInvitationTokenRepository(): IFindOneAccountEmailByInvitationTokenRepository;
  makeFindOneIssueRepository(): IFindOneIssueRepository;
  makeCreateInvitationTokenRepository(): ICreateInvitationTokenRepository;
  makeHasAccountBeenInvitedToProjectRepository(): IHasAccountBeenInvitedToProjectRepository;
  makeFindProjectNameByProjectIdRepository(): IFindProjectNameByProjectIdRepository;
  makeDeleteIssueRepository(): IDeleteIssueRepository;
  makeCreateIssueRepository(): ICreateIssueRepository;
  makeHasProjectBegunRepository(): IHasProjectBegunRepository;
  makeFindStartDateByProjectIdRepository(): IFindStartDateByProjectIdRepository;
  makeIsProjectArchivedRepository(): IIsProjectArchivedRepository;
  makeCreateIssueGroupForProjectRepository(): ICreateIssueGroupForProjectRepository;
  makeListProjectsOwnedByAccountRepository(): IListProjectsOwnedByAccountRepository;
  makeUpdateProjectRepository(): IUpdateProjectRepository;
  makeDeleteProjectRepository(): IDeleteProjectRepository;
  makeUpdateIssueGroupColorRepository(): IUpdateIssueGroupColorRepository;
  makeUpdateIssueGroupFinalStatusRepository(): IUpdateIssueGroupFinalStatusRepository;
  makeFindProjectImageDataURLRepository(): IFindProjectImageDataURLRepository;
  makeUpdateProjectImageRepository(): IUpdateProjectImageRepository;
  makeReportIssuesWeeklyOverviewMetricsRepository(): IReportIssuesWeeklyOverviewMetricsRepository;
  makeReportIssuesMonthlyOverviewMetricsRepository(): IReportIssuesMonthlyOverviewMetricsRepository;
  makeReportExpiredIssuesMetricsRepository(): IReportExpiredIssuesMetricsRepository;
  makeReportAllIssuesMetricsRepository(): IReportAllIssuesMetricsRepository;
  makeReportIssuesForTodayMetricsRepository(): IReportIssuesForTodayMetricsRepository;
  makeFindOneAccountIdByEmailRepository(): IFindOneAccountIdByEmailRepository;
  makeAssignIssueToAccountRepository(): IAssignIssueToAccountRepository;
  makeFindIssueTitleByProjectIdRepository(): IFindIssueTitleByIssueIdRepository;
  makeFindAccountEmailAssignedToIssueRepository(): IFindAccountEmailAssignedToIssueRepository;
  makeFindAllEmailsParticipantInProjectRepository(): IFindAllEmailsParticipantInProject;
  makeFindAllEmailsOfOwnersAndAdminsOfProjectRepository(): IFindAllEmailsOfOwnersAndAdminsOfProjectRepository;
  makeListParticipantsInvitedToProjectRepository(): IListParticipantsInvitedToProjectRepository;
  makeFindOneProjectRepository(): IFindOneProjectRepository;
  makeFindOneProjectIdByInvitationTokenRepository(): IFindOneProjectIdByInvitationTokenRepository;
}
