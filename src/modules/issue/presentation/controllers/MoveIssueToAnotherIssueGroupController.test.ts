import { MoveIssueToAnotherIssueGroupUseCase } from "@modules/issue/use-cases";
import {
  IssueGroupBelongsToDifferentProjectError,
  IssueGroupNotFoundError,
  IssueNotFoundError,
} from "@modules/issue/use-cases/errors";
import {
  IIssueGroupBelongsToDifferentProjectErrorLanguage,
  IIssueGroupNotFoundErrorLanguage,
  IIssueNotFoundErrorLanguage,
} from "@modules/issue/use-cases/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IValidation } from "@shared/presentation/validation";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors";
import { IRoleInsufficientPermissionErrorLanguage } from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import { MoveIssueToAnotherIssueGroupController } from "./MoveIssueToAnotherIssueGroupController";

const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
const issueGroupNotFoundErrorLanguageMock =
  mock<IIssueGroupNotFoundErrorLanguage>();
const issueGroupBelongsToDifferentProjectErrorLanguageMock =
  mock<IIssueGroupBelongsToDifferentProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const moveIssueToAnotherIssueGroupUseCaseMock =
    mock<MoveIssueToAnotherIssueGroupUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new MoveIssueToAnotherIssueGroupController(
    moveIssueToAnotherIssueGroupUseCaseMock,
    validationMock
  );

  return {
    sut,
    moveIssueToAnotherIssueGroupUseCaseMock,
    validationMock,
  };
}

describe("moveIssueToAnotherIssueGroup controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, moveIssueToAnotherIssueGroupUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      moveIssueToAnotherIssueGroupUseCaseMock.moveIssue
    ).toHaveBeenNthCalledWith(1, givenRequest);
  });

  it("should return HttpStatusCodes.notFound if IssueNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, moveIssueToAnotherIssueGroupUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    moveIssueToAnotherIssueGroupUseCaseMock.moveIssue.mockImplementationOnce(
      () => {
        throw new IssueNotFoundError(issueNotFoundErrorLanguageMock);
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(IssueNotFoundError);
  });

  it("should return HttpStatusCodes.notFound if IssueGroupNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, moveIssueToAnotherIssueGroupUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    moveIssueToAnotherIssueGroupUseCaseMock.moveIssue.mockImplementationOnce(
      () => {
        throw new IssueGroupNotFoundError(issueGroupNotFoundErrorLanguageMock);
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(IssueGroupNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if IssueGroupBelongsToDifferentProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, moveIssueToAnotherIssueGroupUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    moveIssueToAnotherIssueGroupUseCaseMock.moveIssue.mockImplementationOnce(
      () => {
        throw new IssueGroupBelongsToDifferentProjectError(
          issueGroupBelongsToDifferentProjectErrorLanguageMock
        );
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(
      IssueGroupBelongsToDifferentProjectError
    );
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, moveIssueToAnotherIssueGroupUseCaseMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    moveIssueToAnotherIssueGroupUseCaseMock.moveIssue.mockImplementationOnce(
      () => {
        throw new RoleInsufficientPermissionError(
          "user-role",
          roleInsufficientPermissionErrorLanguageMock
        );
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCodes.serverError when unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, moveIssueToAnotherIssueGroupUseCaseMock } = makeSut();
    moveIssueToAnotherIssueGroupUseCaseMock.moveIssue.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
