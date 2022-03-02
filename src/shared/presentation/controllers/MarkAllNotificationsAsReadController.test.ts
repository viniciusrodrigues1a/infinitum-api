import { mock } from "jest-mock-extended";
import { HttpStatusCodes } from "../http/HttpStatusCodes";
import { IMarkAllAsReadNotificationRepository } from "../interfaces/repositories";
import { MarkAllNotificationsAsReadController } from "./MarkAllNotificationsAsReadController";

function makeSut() {
  const markAllAsReadNotificationRepositoryMock =
    mock<IMarkAllAsReadNotificationRepository>();
  const sut = new MarkAllNotificationsAsReadController(
    markAllAsReadNotificationRepositoryMock
  );

  return { sut, markAllAsReadNotificationRepositoryMock };
}

describe("mark all notifications as read controller", () => {
  it("should return HttpStatusCodes.noContent and call IMarkAllAsReadNotificationRepository", async () => {
    expect.assertions(2);

    const { sut, markAllAsReadNotificationRepositoryMock } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      markAllAsReadNotificationRepositoryMock.markAllAsRead
    ).toHaveBeenNthCalledWith(1, givenRequest.accountEmailMakingRequest);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, markAllAsReadNotificationRepositoryMock } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
    };
    markAllAsReadNotificationRepositoryMock.markAllAsRead.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
