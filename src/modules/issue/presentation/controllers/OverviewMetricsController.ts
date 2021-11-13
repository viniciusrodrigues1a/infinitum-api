import {
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { IReportExpiredIssuesMetricsRepository } from "../interfaces";

export class OverviewMetricsController implements IController {
  constructor(
    private readonly reportExpiredIssuesMetricsRepository: IReportExpiredIssuesMetricsRepository
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
  }: AccountMakingRequestDTO): Promise<HttpResponse> {
    try {
      const expiredIssues =
        await this.reportExpiredIssuesMetricsRepository.reportExpiredIssues({
          accountEmailMakingRequest,
        });

      return okResponse(expiredIssues);
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
