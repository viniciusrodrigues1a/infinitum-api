import { IssueGroupNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueGroupNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import { DeleteIssueGroupUseCase } from "@modules/project/use-cases";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import {
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import {
  DeleteIssueGroupController,
  DeleteIssueGroupControllerRequest,
} from "./DeleteIssueGroupController";

const issueGroupNotFoundErrorLanguageMock =
  mock<IIssueGroupNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const deleteIssueGroupUseCaseMock = mock<DeleteIssueGroupUseCase>();
  const sut = new DeleteIssueGroupController(deleteIssueGroupUseCaseMock);

  return {
    sut,
    deleteIssueGroupUseCaseMock,
  };
}

describe("deleteIssueGroup controller", () => {
  it("should return HttpStatusCodes.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, deleteIssueGroupUseCaseMock } = makeSut();
    const givenRequest: DeleteIssueGroupControllerRequest = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(deleteIssueGroupUseCaseMock.deleteIssueGroup).toHaveBeenCalledTimes(
      1
    );
  });

  it("should return HttpStatusCodes.notFound if IssueGroupNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueGroupUseCaseMock } = makeSut();
    const errThrown = new IssueGroupNotFoundError(
      issueGroupNotFoundErrorLanguageMock
    );
    deleteIssueGroupUseCaseMock.deleteIssueGroup.mockImplementationOnce(() => {
      throw errThrown;
    });
    const givenRequest: DeleteIssueGroupControllerRequest = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueGroupUseCaseMock } = makeSut();
    const email = "amy@email.com";
    const errThrown = new NotParticipantInProjectError(
      email,
      notParticipantInProjectErrorLanguageMock
    );
    deleteIssueGroupUseCaseMock.deleteIssueGroup.mockImplementationOnce(() => {
      throw errThrown;
    });
    const givenRequest: DeleteIssueGroupControllerRequest = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: email,
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, deleteIssueGroupUseCaseMock } = makeSut();
    const errThrown = new RoleInsufficientPermissionError(
      "user-role",
      roleInsufficientPermissionErrorLanguageMock
    );
    deleteIssueGroupUseCaseMock.deleteIssueGroup.mockImplementationOnce(() => {
      throw errThrown;
    });
    const givenRequest: DeleteIssueGroupControllerRequest = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, deleteIssueGroupUseCaseMock } = makeSut();
    deleteIssueGroupUseCaseMock.deleteIssueGroup.mockImplementationOnce(() => {
      throw new Error("unhandled server-side err");
    });
    const givenRequest: DeleteIssueGroupControllerRequest = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
