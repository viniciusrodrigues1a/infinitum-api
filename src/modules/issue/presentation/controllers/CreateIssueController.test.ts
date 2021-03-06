import { CreateIssueUseCase } from "@modules/issue/use-cases/CreateIssueUseCase";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
import {
  IProjectHasntBegunErrorLanguage,
  IProjectIsArchivedErrorLanguage,
} from "@modules/project/use-cases/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IValidation } from "@shared/presentation/validation";
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

function makeSut() {
  const createIssueUseCaseMock = mock<CreateIssueUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new CreateIssueController(createIssueUseCaseMock, validationMock);

  return { sut, createIssueUseCaseMock, validationMock };
}

describe("createIssue controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.created with the issue's id", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueGroupId: "ig-id-0",
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
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueGroupId: "ig-id-0",
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
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueUseCaseMock.create.mockImplementationOnce(() => {
      throw new ProjectHasntBegunError(
        new Date(),
        projectHasntBegunErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(ProjectHasntBegunError);
  });

  it("should return HttpStatusCodes.badRequest if ProjectIsArchivedError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueGroupId: "ig-id-0",
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
      issueGroupId: "ig-id-0",
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

  it("should return HttpStatusCodes.serverError with the issue's id", async () => {
    expect.assertions(1);

    const { sut, createIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueGroupId: "ig-id-0",
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
