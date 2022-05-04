import { DeleteProjectUseCase } from "@modules/project/use-cases";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import { IProjectDeletedTemplateLanguage } from "../interfaces/languages";
import {
  IFindAllEmailsParticipantInProject,
  IFindProjectNameByProjectIdRepository,
} from "../interfaces/repositories";
import { DeleteProjectController } from "./DeleteProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const deleteProjectUseCaseMock = mock<DeleteProjectUseCase>();
  const findProjectNameByProjectIdRepositoryMock =
    mock<IFindProjectNameByProjectIdRepository>();
  const findAllEmailsParticipantInProjectMock =
    mock<IFindAllEmailsParticipantInProject>();
  const notificationServiceMock = mock<INotificationService>();
  const projectDeletedTemplateLanguageMock =
    mock<IProjectDeletedTemplateLanguage>();
  const sut = new DeleteProjectController(
    deleteProjectUseCaseMock,
    findProjectNameByProjectIdRepositoryMock,
    findAllEmailsParticipantInProjectMock,
    notificationServiceMock,
    projectDeletedTemplateLanguageMock
  );

  return {
    sut,
    deleteProjectUseCaseMock,
    findProjectNameByProjectIdRepositoryMock,
    findAllEmailsParticipantInProjectMock,
    notificationServiceMock,
    projectDeletedTemplateLanguageMock,
  };
}

describe("deleteProject controller", () => {
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(2);

    const {
      sut,
      deleteProjectUseCaseMock,
      findProjectNameByProjectIdRepositoryMock,
      findAllEmailsParticipantInProjectMock,
    } = makeSut();
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      "my project"
    );
    findAllEmailsParticipantInProjectMock.findAllEmails.mockResolvedValueOnce([
      "jorge@email.com",
      "alan@email.com",
    ]);
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(deleteProjectUseCaseMock.delete).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should call the notificationService", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectNameByProjectIdRepositoryMock,
      findAllEmailsParticipantInProjectMock,
      notificationServiceMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const projectName = "my project";
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      projectName
    );
    const mockedEmails = ["jorge@email.com", "alan@email.com"];
    findAllEmailsParticipantInProjectMock.findAllEmails.mockResolvedValueOnce(
      mockedEmails
    );

    await sut.handleRequest(givenRequest);

    expect(notificationServiceMock.notify).toHaveBeenCalledTimes(1);
  });

  it("shouldn't notify the account making the request", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectNameByProjectIdRepositoryMock,
      findAllEmailsParticipantInProjectMock,
      notificationServiceMock,
      projectDeletedTemplateLanguageMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const projectName = "my project";
    findProjectNameByProjectIdRepositoryMock.findProjectNameByProjectId.mockResolvedValueOnce(
      projectName
    );
    const mockedEmails = ["jorge@email.com", "alan@email.com"];
    findAllEmailsParticipantInProjectMock.findAllEmails.mockResolvedValueOnce(
      mockedEmails
    );

    await sut.handleRequest(givenRequest);

    const expectedFilteredEmails = mockedEmails.filter(
      (e) => e !== givenRequest.accountEmailMakingRequest
    );
    expect(notificationServiceMock.notify).toHaveBeenNthCalledWith(1, "", {
      projectName,
      emails: expectedFilteredEmails,
      projectDeletedTemplateLanguage: projectDeletedTemplateLanguageMock,
    });
  });

  it("should return HttpStatusCodes.notFound if useCase throws ProjectNotFoundError", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    const projectId = "project-id-0";
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest({
      projectId,
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if useCase throws NotParticipantInProjectError", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    const accountEmail = "jorge@email.com";
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        accountEmail,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest({
      projectId: "project-id-0",
      accountEmailMakingRequest: accountEmail,
    });

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCodes.unauthorized if useCase throws RoleInsufficientPermissionError", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest({
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCodes.serverError if useCase throws an unhandled error", async () => {
    expect.assertions(1);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new Error("unhandled internal error");
    });

    const response = await sut.handleRequest({
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
