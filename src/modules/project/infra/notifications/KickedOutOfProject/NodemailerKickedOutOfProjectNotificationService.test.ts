import { mock } from "jest-mock-extended";
import { IKickedTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { KickedTemplate } from "@modules/project/presentation/templates";
import { NodemailerKickedOutOfProjectNotificationService } from "./NodemailerKickedOutOfProjectNotificationService";
import { SendKickedEmailJob } from "../../jobs";

const kickedTemplateLanguageMock = mock<IKickedTemplateLanguage>();

function makeSut() {
  const queueMock = mock<IQueue>();
  const shouldAccountReceiveNotificationMock =
    mock<IShouldAccountReceiveNotificationRepository>();
  const findProjectNameByProjectIdRepositoryMock =
    mock<IFindProjectNameByProjectIdRepository>();
  const sut = new NodemailerKickedOutOfProjectNotificationService(
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

describe("kicked out of project email notification", () => {
  it("shouldn't call queueMock if shouldAccountReceiveNotificationMock returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      queueMock,
      shouldAccountReceiveNotificationMock,
      findProjectNameByProjectIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      kickedTemplateLanguage: kickedTemplateLanguageMock,
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
      projectId: "project-id-0",
      kickedTemplateLanguage: kickedTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      "my project"
    );

    const message = "mocked msg";
    kickedTemplateLanguageMock.getKickedText.mockReturnValueOnce(message);
    const subjectMessage = "mocked subject msg";
    kickedTemplateLanguageMock.getKickedEmailSubject.mockReturnValueOnce(
      subjectMessage
    );

    await sut.notify(givenEmail, givenRequest);

    const html = new KickedTemplate().parseTemplate({ kickedText: message });
    expect(queueMock.add).toHaveBeenNthCalledWith(
      1,
      new SendKickedEmailJob().key,
      {
        subject: subjectMessage,
        email: givenEmail,
        html,
      }
    );
  });
});
