import { IIssuesWeeklyOverviewWeekdaysLanguage } from "../languages";
import { MetricsRepositoryDTO } from "./MetricsRepositoryDTO";

export type IssuesWeeklyOverviewMetrics = [
  { date: string; value: number },
  { date: string; value: number },
  { date: string; value: number },
  { date: string; value: number },
  { date: string; value: number },
  { date: string; value: number },
  { date: string; value: number }
];

export interface IReportIssuesWeeklyOverviewMetricsRepository {
  reportIssuesWeeklyOverview(
    data: MetricsRepositoryDTO,
    issuesWeeklyOverviewWeekdaysLanguage: IIssuesWeeklyOverviewWeekdaysLanguage
  ): Promise<IssuesWeeklyOverviewMetrics>;
}
