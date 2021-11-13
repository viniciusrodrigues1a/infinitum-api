import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IReportExpiredIssuesMetricsRepository } from "../interfaces";
import { OverviewMetricsController } from "./OverviewMetricsController";

function makeSut() {
  const reportExpiredIssuesMetricsRepositoryMock =
    mock<IReportExpiredIssuesMetricsRepository>();
  const sut = new OverviewMetricsController(
    reportExpiredIssuesMetricsRepositoryMock
  );

  return { sut, reportExpiredIssuesMetricsRepositoryMock };
}

describe("overviewMetrics controller", () => {
  it("should return HttpStatusCodes.ok and call the repository", async () => {
    expect.assertions(2);

    const { sut, reportExpiredIssuesMetricsRepositoryMock } = makeSut();

    const response = await sut.handleRequest({
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(
      reportExpiredIssuesMetricsRepositoryMock.reportExpiredIssues
    ).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.serverError", async () => {
    expect.assertions(1);

    const { sut, reportExpiredIssuesMetricsRepositoryMock } = makeSut();
    reportExpiredIssuesMetricsRepositoryMock.reportExpiredIssues.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side error");
      }
    );

    const response = await sut.handleRequest({
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
