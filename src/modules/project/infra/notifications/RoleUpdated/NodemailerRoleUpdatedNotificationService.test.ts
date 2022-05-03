import { IRoleUpdatedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { RoleUpdatedTemplate } from "@modules/project/presentation/templates";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { mock } from "jest-mock-extended";
import { SendRoleUpdatedEmailJob } from "../../jobs";
import { NodemailerRoleUpdatedNotificationService } from "./NodemailerRoleUpdatedNotificationService";

const roleUpdatedTemplatedLanguageMock = mock<IRoleUpdatedTemplateLanguage>();

function makeSut() {
  const queueMock = mock<IQueue>();
  const shouldAccountReceiveNotificationMock =
    mock<IShouldAccountReceiveNotificationRepository>();
  const findProjectNameByProjectIdRepositoryMock =
    mock<IFindProjectNameByProjectIdRepository>();
  const sut = new NodemailerRoleUpdatedNotificationService(
    queueMock,
    shouldAccountReceiveNotificationMock,
    findProjectNameByProjectIdRepositoryMock
  );

  return {
    sut,
    queueMock,
    shouldAccountReceiveNotificationMock,
    findProjectNameByProjectIdRepositoryMock,
  };
}

describe("role in project updated email notification", () => {
  it("shouldn't call queueMock if shouldAccountReceiveNotificationMock returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      queueMock,
      shouldAccountReceiveNotificationMock,
      findProjectNameByProjectIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      roleUpdatedTemplateLanguage: roleUpdatedTemplatedLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      false
    );
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      "my project"
    );

    await sut.notify("jorge@email.com", givenRequest);

    expect(queueMock.add).toHaveBeenCalledTimes(0);
  });

  it("should call queueMock", async () => {
    expect.assertions(1);

    const {
      sut,
      queueMock,
      shouldAccountReceiveNotificationMock,
      findProjectNameByProjectIdRepositoryMock,
    } = makeSut();
    const givenEmail = "jorge@email.com";
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      roleUpdatedTemplateLanguage: roleUpdatedTemplatedLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      "my project"
    );

    const message = "mocked msg";
    roleUpdatedTemplatedLanguageMock.getRoleUpdatedText.mockReturnValueOnce(
      message
    );
    const subjectMessage = "mocked subject msg";
    roleUpdatedTemplatedLanguageMock.getRoleUpdatedEmailSubject.mockReturnValueOnce(
      subjectMessage
    );

    await sut.notify(givenEmail, givenRequest);

    const html = new RoleUpdatedTemplate().parseTemplate({
      roleUpdatedText: message,
    });
    expect(queueMock.add).toHaveBeenNthCalledWith(
      1,
      new SendRoleUpdatedEmailJob().key,
      {
        subject: subjectMessage,
        email: givenEmail,
        html,
      }
    );
  });
});
