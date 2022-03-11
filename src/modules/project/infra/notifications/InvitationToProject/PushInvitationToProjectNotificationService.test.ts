import { mock } from "jest-mock-extended";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import {
  ICreateNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  IShouldAccountReceiveNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { IInvitationTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { PushInvitationToProjectNotificationService } from "./PushInvitationToProjectNotificationService";

const invitationTemplateLanguageMock = mock<IInvitationTemplateLanguage>();

function makeSut() {
  const shouldAccountReceiveNotificationMock =
    mock<IShouldAccountReceiveNotificationRepository>();
  const findOneAccountIdByEmailRepositoryMock =
    mock<IFindOneAccountIdByEmailRepository>();
  const findProjectNameByProjectIdRepositoryMock =
    mock<IFindProjectNameByProjectIdRepository>();
  const createNotificationRepositoryMock =
    mock<ICreateNotificationRepository>();
  const socketServerEmitterMock = mock<ISocketServerEmitter>();
  const sut = new PushInvitationToProjectNotificationService(
    shouldAccountReceiveNotificationMock,
    findOneAccountIdByEmailRepositoryMock,
    findProjectNameByProjectIdRepositoryMock,
    createNotificationRepositoryMock,
    socketServerEmitterMock
  );

  return {
    sut,
    shouldAccountReceiveNotificationMock,
    findOneAccountIdByEmailRepositoryMock,
    findProjectNameByProjectIdRepositoryMock,
    createNotificationRepositoryMock,
    socketServerEmitterMock,
  };
}

describe("invitation to project push notification", () => {
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
      token: "invitation-token-0",
      projectId: "project-id-0",
      invitationTemplateLanguage: invitationTemplateLanguageMock,
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
      token: "invitation-token-0",
      projectId: "project-id-0",
      invitationTemplateLanguage: invitationTemplateLanguageMock,
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
      findProjectNameByProjectIdRepositoryMock,
      createNotificationRepositoryMock,
      socketServerEmitterMock,
    } = makeSut();
    const givenEmail = "jorge@email.com";
    const givenRequest = {
      token: "invitation-token-0",
      projectId: "project-id-0",
      invitationTemplateLanguage: invitationTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    const accountId = "account-id-0";
    findOneAccountIdByEmailRepositoryMock.findOneAccountIdByEmail.mockResolvedValueOnce(
      accountId
    );
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      "my project"
    );

    await sut.notify(givenEmail, givenRequest);

    expect(
      createNotificationRepositoryMock.createNotification
    ).toHaveBeenCalledTimes(1);
    expect(socketServerEmitterMock.emitToUser).toHaveBeenCalledTimes(1);
  });
});
