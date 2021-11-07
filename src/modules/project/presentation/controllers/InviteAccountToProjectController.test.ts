import { OwnerCantBeUsedAsARoleForAnInvitationError } from "@modules/project/entities/errors/OwnerCantBeUsedAsARoleForAnInvitationError";
import { IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { InviteAccountToProjectUseCase } from "@modules/project/use-cases";
import {
  AccountAlreadyParticipatesInProjectError,
  AccountHasAlreadyBeenInvitedError,
} from "@modules/project/use-cases/errors";
import {
  IAccountAlreadyParticipatesInProjectErrorLanguage,
  IAccountHasAlreadyBeenInvitedErrorLanguage,
} from "@modules/project/use-cases/interfaces/languages";
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
import { InviteAccountToProjectController } from "./InviteAccountToProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const accountAlreadyParticipatesInProjectErrorLanguageMock =
  mock<IAccountAlreadyParticipatesInProjectErrorLanguage>();
const accountHasAlreadyBeenInvitedErrorLanguageMock =
  mock<IAccountHasAlreadyBeenInvitedErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();
const ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock =
  mock<IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage>();

function makeSut() {
  const inviteAccountToProjectUseCaseMock =
    mock<InviteAccountToProjectUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new InviteAccountToProjectController(
    inviteAccountToProjectUseCaseMock,
    validationMock
  );

  return { sut, inviteAccountToProjectUseCaseMock, validationMock };
}

describe("invitAccountToProject controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCode.noContent", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(inviteAccountToProjectUseCaseMock.invite).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should return HttpStatusCode.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        givenRequest.accountEmailMakingRequest,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCode.badRequest if AccountAlreadyParticipatesInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new AccountAlreadyParticipatesInProjectError(
        givenRequest.accountEmail,
        accountAlreadyParticipatesInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(
      AccountAlreadyParticipatesInProjectError
    );
  });

  it("should return HttpStatusCode.badRequest if AccountHasAlreadyBeenInvitedError is thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new AccountHasAlreadyBeenInvitedError(
        givenRequest.accountEmail,
        accountHasAlreadyBeenInvitedErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(AccountHasAlreadyBeenInvitedError);
  });

  it("should return HttpStatusCode.badRequest if OwnerCantBeUsedAsARoleForAnInvitationErroris thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new OwnerCantBeUsedAsARoleForAnInvitationError(
        ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(
      OwnerCantBeUsedAsARoleForAnInvitationError
    );
  });

  it("should return HttpStatusCode.notFound if ProjectNotFoundError thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCode.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCode.serverError", async () => {
    expect.assertions(1);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
