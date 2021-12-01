import { UpdateIssueUseCase } from "@modules/issue/use-cases";
import { IssueNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IValidation } from "@shared/presentation/validation";
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
import { UpdateIssueController } from "./UpdateIssueController";

const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const updateIssueUseCaseMock = mock<UpdateIssueUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new UpdateIssueController(updateIssueUseCaseMock, validationMock);

  return { sut, updateIssueUseCaseMock, validationMock };
}

describe("updateIssue controller", () => {
  it("should return HttpStatusCodes.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, updateIssueUseCaseMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(updateIssueUseCaseMock.update).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.notFound if IssueNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateIssueUseCaseMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };
    updateIssueUseCaseMock.update.mockImplementationOnce(() => {
      throw new IssueNotFoundError(issueNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(IssueNotFoundError);
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateIssueUseCaseMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };
    updateIssueUseCaseMock.update.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateIssueUseCaseMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };
    updateIssueUseCaseMock.update.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        givenRequest.accountEmailMakingRequest,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateIssueUseCaseMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };
    updateIssueUseCaseMock.update.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCodes.serverError if an unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, updateIssueUseCaseMock } = makeSut();
    const givenRequest = {
      newTitle: "new issue's title",
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
    };
    updateIssueUseCaseMock.update.mockImplementationOnce(() => {
      throw new Error("unhandled server side error");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
