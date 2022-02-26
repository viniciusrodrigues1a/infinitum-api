import { mock } from "jest-mock-extended";
import { IFindProjectNameByProjectIdRepository } from "@modules/project/presentation/interfaces/repositories";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { IInvitationTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { InvitationTemplate } from "@modules/project/presentation/templates";
import { NodemailerInvitationToProjectNotificationService } from "./NodemailerInvitationToProjectNotificationService";
import { SendInvitationEmailJob } from "../../jobs";

const invitationTemplateLanguageMock = mock<IInvitationTemplateLanguage>();

function makeSut() {
  const queueMock = mock<IQueue>();
  const shouldAccountReceiveNotificationMock =
    mock<IShouldAccountReceiveNotificationRepository>();
  const findProjectNameByProjectIdRepositoryMock =
    mock<IFindProjectNameByProjectIdRepository>();
  const sut = new NodemailerInvitationToProjectNotificationService(
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

describe("invitation to project email notification", () => {
  it("shouldn't call queueMock if shouldAccountReceiveNotificationMock returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      queueMock,
      shouldAccountReceiveNotificationMock,
      findProjectNameByProjectIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      token: "invitation-token-0",
      projectId: "project-id-0",
      invitationTemplateLanguage: invitationTemplateLanguageMock,
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
      token: "invitation-token-0",
      projectId: "project-id-0",
      invitationTemplateLanguage: invitationTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      "my project"
    );

    const message = "mocked msg";
    invitationTemplateLanguageMock.getInvitationText.mockReturnValueOnce(
      message
    );
    const acceptMessage = "mocked accept msg";
    invitationTemplateLanguageMock.getAcceptInvitationButtonText.mockReturnValueOnce(
      acceptMessage
    );
    const declineMessage = "mocked decline msg";
    invitationTemplateLanguageMock.getDeclineInvitationButtonText.mockReturnValueOnce(
      declineMessage
    );
    const subjectMessage = "mocked subject msg";
    invitationTemplateLanguageMock.getInvitationEmailSubject.mockReturnValueOnce(
      subjectMessage
    );

    await sut.notify(givenEmail, givenRequest);

    const html = new InvitationTemplate().parseTemplate({
      token: givenRequest.token,
      invitationText: message,
      acceptInvitationButtonText: acceptMessage,
      declineInvitationButtonText: declineMessage,
    });
    expect(queueMock.add).toHaveBeenNthCalledWith(
      1,
      new SendInvitationEmailJob().key,
      {
        subject: subjectMessage,
        email: givenEmail,
        html,
      }
    );
  });
});
