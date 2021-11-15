import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "../languages";

export type IssuesWeeklyOverviewMetrics = [
  { date: "sun"; value: number },
  { date: "mon"; value: number },
  { date: "tue"; value: number },
  { date: "wed"; value: number },
  { date: "thu"; value: number },
  { date: "fri"; value: number },
  { date: "sat"; value: number }
];

export interface IReportIssuesWeeklyOverviewMetricsRepository {
  reportIssuesWeeklyOverview(
    data: AccountMakingRequestDTO,
    issuesWeeklyOverviewWeekdaysLanguage: IIssuesWeeklyOverviewWeekdaysLanguage
  ): Promise<IssuesWeeklyOverviewMetrics>;
}
