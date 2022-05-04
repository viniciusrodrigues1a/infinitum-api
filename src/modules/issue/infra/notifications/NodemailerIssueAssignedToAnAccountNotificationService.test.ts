import { IssueAssignedTemplate } from "@modules/issue/presentation/templates";
import { IIssueAssignedToAnAccountTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
import { IFindProjectIdByIssueIdRepository } from "@modules/project/use-cases/interfaces/repositories";
import { IShouldAccountReceiveNotificationRepository } from "@shared/infra/notifications/interfaces";
import { IQueue } from "@shared/infra/queue/interfaces";
import { mock } from "jest-mock-extended";
import { SendIssueAssignedEmailJob } from "../jobs";
import { IFindIssueTitleByIssueIdRepository } from "./interfaces/repositories";
import { NodemailerIssueAssignedNotificationService } from "./NodemailerIssueAssignedToAnAccountNotificationService";

const issueAssignedTemplateLanguageMock =
  mock<IIssueAssignedToAnAccountTemplateLanguage>();

function makeSut() {
  const queueMock = mock<IQueue>();
  const shouldAccountReceiveNotificationMock =
    mock<IShouldAccountReceiveNotificationRepository>();
  const findProjectIdByIssueIdRepositoryMock =
    mock<IFindProjectIdByIssueIdRepository>();
  const findIssueTitleByIssueIdRepositoryMock =
    mock<IFindIssueTitleByIssueIdRepository>();
  const sut = new NodemailerIssueAssignedNotificationService(
    queueMock,
    shouldAccountReceiveNotificationMock,
    findProjectIdByIssueIdRepositoryMock,
    findIssueTitleByIssueIdRepositoryMock
  );

  return {
    sut,
    queueMock,
    shouldAccountReceiveNotificationMock,
    findProjectIdByIssueIdRepositoryMock,
    findIssueTitleByIssueIdRepositoryMock,
  };
}

describe("invitation to project email notification", () => {
  it("shouldn't call queueMock if shouldAccountReceiveNotificationMock returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      queueMock,
      shouldAccountReceiveNotificationMock,
      findProjectIdByIssueIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      issueAssignedTemplateLanguage: issueAssignedTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      false
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
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
      findProjectIdByIssueIdRepositoryMock,
    } = makeSut();
    const givenEmail = "jorge@email.com";
    const givenRequest = {
      issueId: "issue-id-0",
      issueAssignedTemplateLanguage: issueAssignedTemplateLanguageMock,
    };
    shouldAccountReceiveNotificationMock.shouldAccountReceiveNotification.mockResolvedValueOnce(
      true
    );
    const projectId = "project-id-0";
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      projectId
    );

    const message = "mocked msg";
    issueAssignedTemplateLanguageMock.getIssueAssignedText.mockReturnValueOnce(
      message
    );
    const buttonMessage = "mocked button msg";
    issueAssignedTemplateLanguageMock.getIssueAssignedLinkToProjectButtonText.mockReturnValueOnce(
      buttonMessage
    );
    const subjectMessage = "mocked subject msg";
    issueAssignedTemplateLanguageMock.getIssueAssignedEmailSubject.mockReturnValueOnce(
      subjectMessage
    );

    await sut.notify(givenEmail, givenRequest);

    const html = new IssueAssignedTemplate().parseTemplate({
      projectId,
      issueAssignedText: message,
      linkToProjectButtonText: buttonMessage,
    });
    expect(queueMock.add).toHaveBeenNthCalledWith(
      1,
      new SendIssueAssignedEmailJob().key,
      {
        subject: subjectMessage,
        email: givenEmail,
        html,
      }
    );
  });
});
