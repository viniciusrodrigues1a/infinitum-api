import { mock } from "jest-mock-extended";
import { HttpStatusCodes } from "../http/HttpStatusCodes";
import { NotificationSettingsDTO } from "../interfaces/DTOs";
import { INotificationNotFoundErrorLanguage } from "../interfaces/languages";
import { IFindOneNotificationSettingsRepository } from "../interfaces/repositories";
import {
  FindOneNotificationSettingsController,
  FindOneNotificationSettingsControllerRequest,
} from "./FindOneNotificationSettingsController";

function makeSut() {
  const findOneNotificationsSettingRepositoryMock =
    mock<IFindOneNotificationSettingsRepository>();
  const notificationNotFoundErrorLanguageMock =
    mock<INotificationNotFoundErrorLanguage>();
  const sut = new FindOneNotificationSettingsController(
    findOneNotificationsSettingRepositoryMock,
    notificationNotFoundErrorLanguageMock
  );

  return { sut, findOneNotificationsSettingRepositoryMock };
}

describe("find one notification settings controller", () => {
  it("should return HttpStatusCodes.ok and call IFindOneNotificationSettingsRepository", async () => {
    expect.assertions(2);

    const { sut, findOneNotificationsSettingRepositoryMock } = makeSut();
    const givenRequest: FindOneNotificationSettingsControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
    };
    findOneNotificationsSettingRepositoryMock.findOneNotificationsSetting.mockResolvedValueOnce(
      {} as NotificationSettingsDTO
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(
      findOneNotificationsSettingRepositoryMock.findOneNotificationsSetting
    ).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.notFound if IFindOneNotificationSettingsRepository returns undefined", async () => {
    expect.assertions(1);

    const { sut, findOneNotificationsSettingRepositoryMock } = makeSut();
    const givenRequest: FindOneNotificationSettingsControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
    };
    findOneNotificationsSettingRepositoryMock.findOneNotificationsSetting.mockResolvedValueOnce(
      undefined
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.serverError if an unhandled server err is thrown", async () => {
    expect.assertions(1);

    const { sut, findOneNotificationsSettingRepositoryMock } = makeSut();
    const givenRequest: FindOneNotificationSettingsControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
    };
    findOneNotificationsSettingRepositoryMock.findOneNotificationsSetting.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
