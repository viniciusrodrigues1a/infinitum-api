import { Issue } from "@modules/issue/entities";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type AllIssuesMetrics = {
  percentageCompleted: number;
  leftUncompleted: number;
  total: number;
  issues: Issue[];
};

export interface IReportAllIssuesMetricsRepository {
  reportAllIssues(data: AccountMakingRequestDTO): Promise<AllIssuesMetrics>;
}
