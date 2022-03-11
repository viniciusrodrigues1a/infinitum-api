import { mock } from "jest-mock-extended";
import { IRoleUpdatedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import {
  ICreateNotificationRepository,
  IFindOneAccountIdByEmailRepository,
  IShouldAccountReceiveNotificationRepository,
  ISocketServerEmitter,
} from "@shared/infra/notifications/interfaces";
import { PushRoleUpdatedNotificationService } from "./PushRoleUpdatedNotificationService";

const roleUpdatedTemplateLanguageMock = mock<IRoleUpdatedTemplateLanguage>();

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
  const sut = new PushRoleUpdatedNotificationService(
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
      projectId: "project-id-0",
      roleName: "user-role",
      roleUpdatedTemplateLanguage: roleUpdatedTemplateLanguageMock,
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
      projectId: "project-id-0",
      roleName: "user-role",
      roleUpdatedTemplateLanguage: roleUpdatedTemplateLanguageMock,
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
      projectId: "project-id-0",
      roleName: "user-role",
      roleUpdatedTemplateLanguage: roleUpdatedTemplateLanguageMock,
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
