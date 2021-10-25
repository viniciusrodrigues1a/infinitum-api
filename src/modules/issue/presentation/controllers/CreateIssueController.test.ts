import { CreateIssueUseCase } from "@modules/issue/use-cases/CreateIssueUseCase";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
import {
  IProjectHasntBegunErrorLanguage,
  IProjectIsArchivedErrorLanguage,
} from "@modules/project/use-cases/interfaces/languages";
import { NotFutureDateError } from "@shared/entities/errors";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
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
import { CreateIssueController } from "./CreateIssueController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const projectHasntBegunErrorLanguageMock =
  mock<IProjectHasntBegunErrorLanguage>();
const projectIsArchivedErrorLanguageMock =
  mock<IProjectIsArchivedErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();
const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();

function makeSut() {
  const createIssueUseCaseMock = mock<CreateIssueUseCase>();
  const sut = new CreateIssueController(createIssueUseCaseMock);

  return { sut, createIssueUseCaseMock };
}

describe("createIssue controller", () => {
  it("should return HttpStatusCodes.created with the issue's id", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.created);
    expect(createIssueUseCaseMock.create).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(
        givenRequest.projectId,
        projectNotFoundErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        givenRequest.accountEmailMakingRequest,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCodes.badRequest if ProjectHasntBegunError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new ProjectHasntBegunError(projectHasntBegunErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(ProjectHasntBegunError);
  });

  it("should return HttpStatusCodes.badRequest if ProjectIsArchivedError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new ProjectIsArchivedError(projectIsArchivedErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(ProjectIsArchivedError);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCodes.badRequest if NotFutureDateError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
      begins_at: new Date(),
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new NotFutureDateError(
        givenRequest.begins_at,
        notFutureDateErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotFutureDateError);
  });

  it("should return HttpStatusCodes.serverError with the issue's id", async () => {
    expect.assertions(1);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
