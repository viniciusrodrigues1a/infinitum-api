import { Issue } from "@modules/issue/entities";
import { MetricsRepositoryDTO } from "./MetricsRepositoryDTO";

export type IssuesForTodayMetrics = {
  percentageCompleted: number;
  issues: Issue & { projectName: string }[];
};

export interface IReportIssuesForTodayMetricsRepository {
  reportIssuesForToday(
    data: MetricsRepositoryDTO
  ): Promise<IssuesForTodayMetrics>;
}
