import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "../interfaces/languages";
import {
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesWeeklyOverviewMetricsRepository,
} from "../interfaces/repositories";
import { OverviewMetricsController } from "./OverviewMetricsController";

function makeSut() {
  const reportExpiredIssuesMetricsRepositoryMock =
    mock<IReportExpiredIssuesMetricsRepository>();
  const reportIssuesForTodayMetricsRepositoryMock =
    mock<IReportIssuesForTodayMetricsRepository>();
  const reportAllIssuesMetricsRepositoryMock =
    mock<IReportAllIssuesMetricsRepository>();
  const reportIssuesWeeklyOverviewMetricsRepositoryMock =
    mock<IReportIssuesWeeklyOverviewMetricsRepository>();
  const issuesWeeklyOverviewWeekdaysLanguageMock =
    mock<IIssuesWeeklyOverviewWeekdaysLanguage>();

  const sut = new OverviewMetricsController(
    reportExpiredIssuesMetricsRepositoryMock,
    reportIssuesForTodayMetricsRepositoryMock,
    reportAllIssuesMetricsRepositoryMock,
    reportIssuesWeeklyOverviewMetricsRepositoryMock,
    issuesWeeklyOverviewWeekdaysLanguageMock
  );

  return {
    sut,
    reportExpiredIssuesMetricsRepositoryMock,
    reportIssuesForTodayMetricsRepositoryMock,
    reportAllIssuesMetricsRepositoryMock,
    reportIssuesWeeklyOverviewMetricsRepositoryMock,
    issuesWeeklyOverviewWeekdaysLanguageMock,
  };
}

describe("overviewMetrics controller", () => {
  it("should return HttpStatusCodes.ok and call the repositories", async () => {
    expect.assertions(5);

    const {
      sut,
      reportExpiredIssuesMetricsRepositoryMock,
      reportIssuesForTodayMetricsRepositoryMock,
      reportAllIssuesMetricsRepositoryMock,
      reportIssuesWeeklyOverviewMetricsRepositoryMock,
    } = makeSut();

    const response = await sut.handleRequest({
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(
      reportExpiredIssuesMetricsRepositoryMock.reportExpiredIssues
    ).toHaveBeenCalledTimes(1);
    expect(
      reportIssuesForTodayMetricsRepositoryMock.reportIssuesForToday
    ).toHaveBeenCalledTimes(1);
    expect(
      reportAllIssuesMetricsRepositoryMock.reportAllIssues
    ).toHaveBeenCalledTimes(1);
    expect(
      reportIssuesWeeklyOverviewMetricsRepositoryMock.reportIssuesWeeklyOverview
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
