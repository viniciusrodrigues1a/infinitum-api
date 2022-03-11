import { mock } from "jest-mock-extended";
import { HttpStatusCodes } from "../http/HttpStatusCodes";
import { IUpdateNotificationSettingsRepository } from "../interfaces/repositories";
import {
  UpdateNotificationSettingsController,
  UpdateNotificationSettingsControllerRequest,
} from "./UpdateNotificationSettingsController";

function makeSut() {
  const updateNotificationSettingsRepositoryMock =
    mock<IUpdateNotificationSettingsRepository>();
  const sut = new UpdateNotificationSettingsController(
    updateNotificationSettingsRepositoryMock
  );

  return { sut, updateNotificationSettingsRepositoryMock };
}

describe("update notification settings controller", () => {
  it("should return HttpStatusCodes.noContent and call IUpdateNotificationSettingsRepository", async () => {
    expect.assertions(2);

    const { sut, updateNotificationSettingsRepositoryMock } = makeSut();
    const givenRequest: UpdateNotificationSettingsControllerRequest = {
      settings: {
        invitation: { push: false, email: true },
        kicked: { push: true, email: true },
        roleUpdated: { push: false, email: false },
      },
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      updateNotificationSettingsRepositoryMock.updateNotificationSettings
    ).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.serverError if an unhandled err is thrown", async () => {
    expect.assertions(1);

    const { sut, updateNotificationSettingsRepositoryMock } = makeSut();
    const givenRequest: UpdateNotificationSettingsControllerRequest = {
      settings: {
        invitation: { push: false, email: true },
        kicked: { push: true, email: true },
        roleUpdated: { push: false, email: false },
      },
      accountEmailMakingRequest: "jorge@email.com",
    };
    updateNotificationSettingsRepositoryMock.updateNotificationSettings.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
