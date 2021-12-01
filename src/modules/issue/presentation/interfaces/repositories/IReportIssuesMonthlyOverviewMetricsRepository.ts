import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type IssuesMonthlyOverviewMetrics = { date: string; value: number }[];

export interface IReportIssuesMonthlyOverviewMetricsRepository {
  reportIssuesMonthlyOverview(
    data: AccountMakingRequestDTO
  ): Promise<IssuesMonthlyOverviewMetrics>;
}
