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
  IReportIssuesWeeklyOverviewMetricsRepository,
} from "../interfaces/repositories";

export class OverviewMetricsController implements IController {
  constructor(
    private readonly reportExpiredIssuesMetricsRepository: IReportExpiredIssuesMetricsRepository,
    private readonly reportIssuesForTodayMetricsRepository: IReportIssuesForTodayMetricsRepository,
    private readonly reportAllIssuesMetricsRepository: IReportAllIssuesMetricsRepository,
    private readonly reportIssuesWeeklyOverviewMetricsRepositoryMock: IReportIssuesWeeklyOverviewMetricsRepository,
    private readonly issuesWeeklyOverviewWeekdaysLanguage: IIssuesWeeklyOverviewWeekdaysLanguage
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
  }: AccountMakingRequestDTO): Promise<HttpResponse> {
    try {
      const expiredIssues =
        await this.reportExpiredIssuesMetricsRepository.reportExpiredIssues({
          accountEmailMakingRequest,
        });

      const issuesForToday =
        await this.reportIssuesForTodayMetricsRepository.reportIssuesForToday({
          accountEmailMakingRequest,
        });

      const allIssues =
        await this.reportAllIssuesMetricsRepository.reportAllIssues({
          accountEmailMakingRequest,
        });

      const issuesWeeklyOverview =
        await this.reportIssuesWeeklyOverviewMetricsRepositoryMock.reportIssuesWeeklyOverview(
          { accountEmailMakingRequest },
          this.issuesWeeklyOverviewWeekdaysLanguage
        );

      return okResponse({
        expiredIssues,
        issuesForToday,
        allIssues,
        issuesWeeklyOverview,
      });
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
