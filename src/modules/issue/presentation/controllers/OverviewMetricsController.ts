import {
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "../interfaces/languages";
import {
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesMonthlyOverviewMetricsRepository,
  IReportIssuesWeeklyOverviewMetricsRepository,
} from "../interfaces/repositories";

export type OverviewMetricsControllerRequest = AccountMakingRequestDTO & {
  date: string;
};

export class OverviewMetricsController implements IController {
  constructor(
    private readonly reportExpiredIssuesMetricsRepository: IReportExpiredIssuesMetricsRepository,
    private readonly reportIssuesForTodayMetricsRepository: IReportIssuesForTodayMetricsRepository,
    private readonly reportAllIssuesMetricsRepository: IReportAllIssuesMetricsRepository,
    private readonly reportIssuesWeeklyOverviewMetricsRepositoryMock: IReportIssuesWeeklyOverviewMetricsRepository,
    private readonly reportIssuesMonthlyOverviewMetricsRepositoryMock: IReportIssuesMonthlyOverviewMetricsRepository,
    private readonly issuesWeeklyOverviewWeekdaysLanguage: IIssuesWeeklyOverviewWeekdaysLanguage
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
    date,
  }: OverviewMetricsControllerRequest): Promise<HttpResponse> {
    try {
      const expiredIssues =
        await this.reportExpiredIssuesMetricsRepository.reportExpiredIssues({
          accountEmailMakingRequest,
          date,
        });

      const issuesForToday =
        await this.reportIssuesForTodayMetricsRepository.reportIssuesForToday({
          accountEmailMakingRequest,
          date,
        });

      const allIssues =
        await this.reportAllIssuesMetricsRepository.reportAllIssues({
          accountEmailMakingRequest,
        });

      const issuesWeeklyOverview =
        await this.reportIssuesWeeklyOverviewMetricsRepositoryMock.reportIssuesWeeklyOverview(
          { accountEmailMakingRequest, date },
          this.issuesWeeklyOverviewWeekdaysLanguage
        );

      const issuesMonthlyOverview =
        await this.reportIssuesMonthlyOverviewMetricsRepositoryMock.reportIssuesMonthlyOverview(
          { accountEmailMakingRequest }
        );

      return okResponse({
        expiredIssues,
        issuesForToday,
        allIssues,
        issuesWeeklyOverview,
        issuesMonthlyOverview,
      });
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
