import { IIssueAssignedToAnAccountTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectIdByIssueIdRepository } from "@modules/project/use-cases/interfaces/repositories";
import {
  IShouldAccountReceiveNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  ICreateNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { mock } from "jest-mock-extended";
import { IFindIssueTitleByIssueIdRepository } from "./interfaces/repositories";
import { PushIssueAssignedToAnAccountNotificationService } from "./PushIssueAssignedToAnAccountNotificationService";

const issueAssignedTemplateLanguageMock =
  mock<IIssueAssignedToAnAccountTemplateLanguage>();

function makeSut() {
  const shouldAccountReceiveNotificationMock =
    mock<IShouldAccountReceiveNotificationRepository>();
  const findOneAccountIdByEmailRepositoryMock =
    mock<IFindOneAccountIdByEmailRepository>();
  const findIssueTitleByIssueIdRepositoryMock =
    mock<IFindIssueTitleByIssueIdRepository>();
  const findProjectIdByIssueIdRepositoryMock =
    mock<IFindProjectIdByIssueIdRepository>();
  const createNotificationRepositoryMock =
    mock<ICreateNotificationRepository>();
  const socketServerEmitterMock = mock<ISocketServerEmitter>();
  const sut = new PushIssueAssignedToAnAccountNotificationService(
    shouldAccountReceiveNotificationMock,
    findOneAccountIdByEmailRepositoryMock,
    findIssueTitleByIssueIdRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    createNotificationRepositoryMock,
    socketServerEmitterMock
  );

  return {
    sut,
    shouldAccountReceiveNotificationMock,
    findOneAccountIdByEmailRepositoryMock,
    findIssueTitleByIssueIdRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    createNotificationRepositoryMock,
    socketServerEmitterMock,
  };
}

describe("roleUpdated push notification", () => {
  it("shouldn't call createNotificationRepositoryMock and socketServerEmitterMock if shouldAccountReceiveNotificationMock returns false", async () => {
    expect.assertions(2);

    const {
      sut,
      shouldAccountReceiveNotificationMock,
      findOneAccountIdByEmailRepositoryMock,
      createNotificationRepositoryMock,
      socketServerEmitterMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      issueAssignedTemplateLanguage: issueAssignedTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      false
    );
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail.mockResolvedValueOnce(
      "account-id-0"
    );

    await sut.notify("jorge@email.com", givenRequest);

    expect(
      createNotificationRepositoryMock.createNotification
    ).toHaveBeenCalledTimes(0);
    expect(socketServerEmitterMock.emitToUser).toHaveBeenCalledTimes(0);
  });

  it("shouldn't call createNotificationRepositoryMock and socketServerEmitterMock if findOneAccountIdByEmailRepositoryMock returns undefined", async () => {
    expect.assertions(2);

    const {
      sut,
      shouldAccountReceiveNotificationMock,
      findOneAccountIdByEmailRepositoryMock,
      createNotificationRepositoryMock,
      socketServerEmitterMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      issueAssignedTemplateLanguage: issueAssignedTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail.mockResolvedValueOnce(
      undefined
    );

    await sut.notify("jorge@email.com", givenRequest);

    expect(
      createNotificationRepositoryMock.createNotification
    ).toHaveBeenCalledTimes(0);
    expect(socketServerEmitterMock.emitToUser).toHaveBeenCalledTimes(0);
  });

  it("should call createNotificationRepositoryMock and socketServerEmitterMock", async () => {
    expect.assertions(2);

    const {
      sut,
      shouldAccountReceiveNotificationMock,
      findOneAccountIdByEmailRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      createNotificationRepositoryMock,
      socketServerEmitterMock,
    } = makeSut();
    const givenEmail = "jorge@email.com";
    const givenRequest = {
      issueId: "issue-id-0",
      issueAssignedTemplateLanguage: issueAssignedTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    const accountId = "account-id-0";
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail.mockResolvedValueOnce(
      accountId
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );

    await sut.notify(givenEmail, givenRequest);

    expect(
      createNotificationRepositoryMock.createNotification
    ).toHaveBeenCalledTimes(1);
    expect(socketServerEmitterMock.emitToUser).toHaveBeenCalledTimes(1);
  });
});
