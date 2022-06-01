import { Notification } from "@shared/infra/mongodb/models";
import { mock } from "jest-mock-extended";
import { HttpStatusCodes } from "../http/HttpStatusCodes";
import { INotificationNotFoundErrorLanguage } from "../interfaces/languages";
import { INotificationDoesntBelongToYouErrorLanguage } from "../interfaces/languages/INotificationDoesntBelongToYouErrorLanguage";
import {
  IDoesNotificationBelongToAccountEmailRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
} from "../interfaces/repositories";
import { MarkNotificationAsReadController } from "./MarkNotificationAsReadController";

function makeSut() {
  const markAsReadNotificationRepositoryMock =
    mock<IMarkAsReadNotificationRepository>();
  const findOneNotificationRepositoryMock =
    mock<IFindOneNotificationRepository>();
  const doesNotificationBelongToAccountEmailRepositoryMock =
    mock<IDoesNotificationBelongToAccountEmailRepository>();
  const notificationNotFoundErrorLanguageMock =
    mock<INotificationNotFoundErrorLanguage>();
  const notificationDoesntBelongToYouErrorLanguageMock =
    mock<INotificationDoesntBelongToYouErrorLanguage>();

  const sut = new MarkNotificationAsReadController(
    markAsReadNotificationRepositoryMock,
    findOneNotificationRepositoryMock,
    doesNotificationBelongToAccountEmailRepositoryMock,
    notificationNotFoundErrorLanguageMock,
    notificationDoesntBelongToYouErrorLanguageMock
  );

  return {
    sut,
    markAsReadNotificationRepositoryMock,
    findOneNotificationRepositoryMock,
    doesNotificationBelongToAccountEmailRepositoryMock,
  };
}

describe("mark notification as read controller", () => {
  it("should return HttpStatusCodes.noContent and call IMarkAsReadNotificationRepository", async () => {
    expect.assertions(2);

    const {
      sut,
      markAsReadNotificationRepositoryMock,
      doesNotificationBelongToAccountEmailRepositoryMock,
      findOneNotificationRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    const notification: Notification = {
      user_id: "user-id-0",
      type: "INVITATION",
      metadata: {},
      read: false,
      id: givenRequest.notificationId,
    };
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      notification
    );
    doesNotificationBelongToAccountEmailRepositoryMock.doesNotificationBelongToAccountEmail.mockResolvedValueOnce(
      true
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
      doesNotificationBelongToAccountEmailRepositoryMock,
      findOneNotificationRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      undefined
    );
    doesNotificationBelongToAccountEmailRepositoryMock.doesNotificationBelongToAccountEmail.mockResolvedValueOnce(
      true
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.unauthorized", async () => {
    expect.assertions(1);

    const {
      sut,
      doesNotificationBelongToAccountEmailRepositoryMock,
      findOneNotificationRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    const notification: Notification = {
      user_id: "user-id-0912383120",
      type: "INVITATION",
      metadata: {},
      read: false,
      id: givenRequest.notificationId,
    };
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      notification
    );
    doesNotificationBelongToAccountEmailRepositoryMock.doesNotificationBelongToAccountEmail.mockResolvedValueOnce(
      false
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const {
      sut,
      markAsReadNotificationRepositoryMock,
      findOneNotificationRepositoryMock,
      doesNotificationBelongToAccountEmailRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      notificationId: "notification-id-0",
    };
    const notification: Notification = {
      user_id: "user-id-0",
      type: "INVITATION",
      metadata: {},
      read: false,
      id: givenRequest.notificationId,
    };
    findOneNotificationRepositoryMock.findOneNotification.mockResolvedValueOnce(
      notification
    );
    doesNotificationBelongToAccountEmailRepositoryMock.doesNotificationBelongToAccountEmail.mockResolvedValueOnce(
      true
    );
    markAsReadNotificationRepositoryMock.markAsRead.mockImplementationOnce(
      () => {
        throw new Error("unhandled error thrown");
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
