import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "../interfaces/languages";
import {
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesMonthlyOverviewMetricsRepository,
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
  const reportIssuesMonthlyOverviewMetricsRepositoryMock =
    mock<IReportIssuesMonthlyOverviewMetricsRepository>();
  const issuesWeeklyOverviewWeekdaysLanguageMock =
    mock<IIssuesWeeklyOverviewWeekdaysLanguage>();

  const sut = new OverviewMetricsController(
    reportExpiredIssuesMetricsRepositoryMock,
    reportIssuesForTodayMetricsRepositoryMock,
    reportAllIssuesMetricsRepositoryMock,
    reportIssuesWeeklyOverviewMetricsRepositoryMock,
    reportIssuesMonthlyOverviewMetricsRepositoryMock,
    issuesWeeklyOverviewWeekdaysLanguageMock
  );

  return {
    sut,
    reportExpiredIssuesMetricsRepositoryMock,
    reportIssuesForTodayMetricsRepositoryMock,
    reportAllIssuesMetricsRepositoryMock,
    reportIssuesWeeklyOverviewMetricsRepositoryMock,
    reportIssuesMonthlyOverviewMetricsRepositoryMock,
    issuesWeeklyOverviewWeekdaysLanguageMock,
  };
}

describe("overviewMetrics controller", () => {
  it("should return HttpStatusCodes.ok and call the repositories", async () => {
    expect.assertions(6);

    const {
      sut,
      reportExpiredIssuesMetricsRepositoryMock,
      reportIssuesForTodayMetricsRepositoryMock,
      reportAllIssuesMetricsRepositoryMock,
      reportIssuesMonthlyOverviewMetricsRepositoryMock,
      reportIssuesWeeklyOverviewMetricsRepositoryMock,
    } = makeSut();

    const response = await sut.handleRequest({
      accountEmailMakingRequest: "jorge@email.com",
      date: "2022-05-18",
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
    expect(
      reportIssuesMonthlyOverviewMetricsRepositoryMock.reportIssuesMonthlyOverview
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
      date: "2022-05-18",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
