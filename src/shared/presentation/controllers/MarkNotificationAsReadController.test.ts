import { Notification } from "@shared/infra/mongodb/models";
import {
  IFindOneAccountIdByEmailRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
} from "@shared/infra/notifications/interfaces";
import { mock } from "jest-mock-extended";
import { HttpStatusCodes } from "../http/HttpStatusCodes";
import { INotificationNotFoundErrorLanguage } from "../interfaces/languages";
import { INotificationDoesntBelongToYouErrorLanguage } from "../interfaces/languages/INotificationDoesntBelongToYouErrorLanguage";
import { MarkNotificationAsReadController } from "./MarkNotificationAsReadController";

function makeSut() {
  const markAsReadNotificationRepositoryMock =
    mock<IMarkAsReadNotificationRepository>();
  const findOneNotificationRepositoryMock =
    mock<IFindOneNotificationRepository>();
  const findOneAccountIdByEmailRepositoryMock =
    mock<IFindOneAccountIdByEmailRepository>();
  const notificationNotFoundErrorLanguageMock =
    mock<INotificationNotFoundErrorLanguage>();
  const notificationDoesntBelongToYouErrorLanguageMock =
    mock<INotificationDoesntBelongToYouErrorLanguage>();

  const sut = new MarkNotificationAsReadController(
    markAsReadNotificationRepositoryMock,
    findOneNotificationRepositoryMock,
    findOneAccountIdByEmailRepositoryMock,
    notificationNotFoundErrorLanguageMock,
    notificationDoesntBelongToYouErrorLanguageMock
  );

  return {
    sut,
    markAsReadNotificationRepositoryMock,
    findOneNotificationRepositoryMock,
    findOneAccountIdByEmailRepositoryMock,
  };
}

describe("mark notification as read controller", () => {
  it("should return HttpStatusCodes.noContent and call IMarkAsReadNotificationRepository", async () => {
    expect.assertions(2);

    const {
      sut,
      markAsReadNotificationRepositoryMock,
      findOneAccountIdByEmailRepositoryMock,
      findOneNotificationRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    const accountId = "user-id-0";
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail.mockResolvedValueOnce(
      accountId
    );
    const notification: Notification = {
      user_id: accountId,
      type: "INVITATION",
      message: "msg",
      metadata: {},
      read: false,
      id: givenRequest.notificationId,
    };
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      notification
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      markAsReadNotificationRepositoryMock.markAsRead
    ).toHaveBeenNthCalledWith(1, givenRequest.notificationId);
  });

  it("should return HttpStatusCodes.notFound", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneAccountIdByEmailRepositoryMock,
      findOneNotificationRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail(
      "account-id-0"
    );
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      undefined
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.unauthorized", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneAccountIdByEmailRepositoryMock,
      findOneNotificationRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail.mockResolvedValueOnce(
      "user-id-0"
    );
    const notification: Notification = {
      user_id: "user-id-0912383120",
      type: "INVITATION",
      message: "msg",
      metadata: {},
      read: false,
      id: givenRequest.notificationId,
    };
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      notification
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
  });
});
