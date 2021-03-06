import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
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
import { IFindAccountLanguageIsoCodeRepository } from "@shared/infra/notifications/interfaces";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
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
const accountNotFoundErrorLanguageMock = mock<IAccountNotFoundErrorLanguage>();
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

const languagesMock = { "en-us": {} };

function makeSut() {
  const inviteAccountToProjectUseCaseMock =
    mock<InviteAccountToProjectUseCase>();
  const validationMock = mock<IValidation>();
  const notificationServiceMock = mock<INotificationService>();
  const findAccountLanguageIsoCodeRepositoryMock =
    mock<IFindAccountLanguageIsoCodeRepository>();
  findAccountLanguageIsoCodeRepositoryMock.findIsoCode.mockResolvedValue(
    "en-us"
  );
  const sut = new InviteAccountToProjectController(
    inviteAccountToProjectUseCaseMock,
    validationMock,
    notificationServiceMock,
    findAccountLanguageIsoCodeRepositoryMock
  );

  return {
    sut,
    inviteAccountToProjectUseCaseMock,
    validationMock,
    notificationServiceMock,
    findAccountLanguageIsoCodeRepositoryMock,
  };
}

describe("invitAccountToProject controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
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
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(inviteAccountToProjectUseCaseMock.invite).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should call notificationService", async () => {
    expect.assertions(1);

    const { sut, notificationServiceMock, inviteAccountToProjectUseCaseMock } =
      makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    const token = "invitation-token-0";
    inviteAccountToProjectUseCaseMock.invite.mockResolvedValueOnce(token);

    await sut.handleRequest(givenRequest);

    expect(notificationServiceMock.notify).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCode.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
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
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
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
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
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
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
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
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCode.notFound if AccountNotFoundError thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new AccountNotFoundError(
        givenRequest.accountEmail,
        accountNotFoundErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(AccountNotFoundError);
  });

  it("should return HttpStatusCode.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, inviteAccountToProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
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
      accountEmail: "garcia@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    inviteAccountToProjectUseCaseMock.invite.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
