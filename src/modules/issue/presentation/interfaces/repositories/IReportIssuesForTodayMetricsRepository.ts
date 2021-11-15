import { Issue } from "@modules/issue/entities";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type IssuesForTodayMetrics = {
  percentageCompleted: number;
  issues: Issue & { projectName: string }[];
};

export interface IReportIssuesForTodayMetricsRepository {
  reportIssuesForToday(
    data: AccountMakingRequestDTO
  ): Promise<IssuesForTodayMetrics>;
}
