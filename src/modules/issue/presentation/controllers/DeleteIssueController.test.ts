import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import { IssueNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import { DeleteIssueController } from "./DeleteIssueController";

const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const deleteIssueUseCaseMock = mock<DeleteIssueUseCase>();
  const sut = new DeleteIssueController(deleteIssueUseCaseMock);

  return { sut, deleteIssueUseCaseMock };
}

describe("deleteIssue controller", () => {
  it("should return HttpStatusCode.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, deleteIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(deleteIssueUseCaseMock.delete).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should return HttpStatusCode.notFound if IssueNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    deleteIssueUseCaseMock.delete.mockImplementationOnce(() => {
      throw new IssueNotFoundError(issueNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(IssueNotFoundError);
  });

  it("should return HttpStatusCode.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    deleteIssueUseCaseMock.delete.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCode.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    deleteIssueUseCaseMock.delete.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        givenRequest.accountEmailMakingRequest,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCode.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    deleteIssueUseCaseMock.delete.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCode.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, deleteIssueUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    deleteIssueUseCaseMock.delete.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
