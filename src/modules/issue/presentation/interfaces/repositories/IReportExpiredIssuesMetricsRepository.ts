import { Issue } from "@modules/issue/entities";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type ExpiredIssuesMetrics = {
  amount: number;
  issues: Issue & { projectName: string }[];
};

export interface IReportExpiredIssuesMetricsRepository {
  reportExpiredIssues(
    data: AccountMakingRequestDTO
  ): Promise<ExpiredIssuesMetrics>;
}
