import { Issue } from "@modules/issue/entities";
import { MetricsRepositoryDTO } from "./MetricsRepositoryDTO";

export type ExpiredIssuesMetrics = {
  amount: number;
  issues: Issue & { projectName: string }[];
};

export interface IReportExpiredIssuesMetricsRepository {
  reportExpiredIssues(
    data: MetricsRepositoryDTO
  ): Promise<ExpiredIssuesMetrics>;
}
