import { CreateIssueGroupForProjectUseCase } from "@modules/project/use-cases/CreateIssueGroupForProjectUseCase";
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
import { CreateIssueGroupForProjectController } from "./CreateIssueGroupForProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const createIssueGroupForProjectUseCaseMock =
    mock<CreateIssueGroupForProjectUseCase>();
  const sut = new CreateIssueGroupForProjectController(
    createIssueGroupForProjectUseCaseMock
  );

  return { sut, createIssueGroupForProjectUseCaseMock };
}

describe("createIssueGroupForProject controller", () => {
  it("should return HttpStatusCodes.created with the issueGroup id", async () => {
    expect.assertions(2);

    const { sut, createIssueGroupForProjectUseCaseMock } = makeSut();
    const givenIssueGroup = {
      title: "In progress",
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenIssueGroup);

    expect(response.statusCode).toBe(HttpStatusCodes.created);
    expect(
      createIssueGroupForProjectUseCaseMock.create
    ).toHaveBeenNthCalledWith(1, givenIssueGroup);
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueGroupForProjectUseCaseMock } = makeSut();
    const givenIssueGroup = {
      title: "In progress",
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueGroupForProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenIssueGroup);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueGroupForProjectUseCaseMock } = makeSut();
    const givenIssueGroup = {
      title: "In progress",
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueGroupForProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        givenIssueGroup.accountEmailMakingRequest,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenIssueGroup);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, createIssueGroupForProjectUseCaseMock } = makeSut();
    const givenIssueGroup = {
      title: "In progress",
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createIssueGroupForProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenIssueGroup);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCodes.serverError if an unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, createIssueGroupForProjectUseCaseMock } = makeSut();
    createIssueGroupForProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest({
      title: "In progress",
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
