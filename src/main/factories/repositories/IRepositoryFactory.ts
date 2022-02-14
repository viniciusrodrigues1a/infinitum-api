import {
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
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesMonthlyOverviewMetricsRepository,
  IReportIssuesWeeklyOverviewMetricsRepository,
} from "@modules/issue/presentation/interfaces/repositories";
import {
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
  IFindProjectImageBufferRepository,
  IUpdateIssueGroupColorRepository,
  IUpdateIssueGroupFinalStatusRepository,
  IUpdateProjectImageRepository,
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
  IFindProjectNameByProjectIdRepository,
  IFindStartDateByProjectIdRepository,
  IHasAccountBeenInvitedToProjectRepository,
  IHasProjectBegunRepository,
  IIsInvitationTokenValidRepository,
  IIsProjectArchivedRepository,
  IKickParticipantFromProjectRepository,
  IListProjectsOwnedByAccountRepository,
  IRevokeInvitationRepository,
  IUpdateParticipantRoleInProjectRepository,
  IUpdateProjectRepository,
} from "@modules/project/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterRepository(language: ILanguage): IRegisterRepository;
  makeLoginRepository(language: ILanguage): ILoginRepository;
  makeUpdateAccountRepository(): IUpdateAccountRepository;
  makeUpdateAccountImageRepository(): IUpdateAccountImageRepository;
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
  makeFindProjectImageBufferRepository(): IFindProjectImageBufferRepository;
  makeUpdateProjectImageRepository(): IUpdateProjectImageRepository;
  makeReportIssuesWeeklyOverviewMetricsRepository(): IReportIssuesWeeklyOverviewMetricsRepository;
  makeReportIssuesMonthlyOverviewMetricsRepository(): IReportIssuesMonthlyOverviewMetricsRepository;
  makeReportExpiredIssuesMetricsRepository(): IReportExpiredIssuesMetricsRepository;
  makeReportAllIssuesMetricsRepository(): IReportAllIssuesMetricsRepository;
  makeReportIssuesForTodayMetricsRepository(): IReportIssuesForTodayMetricsRepository;
}
