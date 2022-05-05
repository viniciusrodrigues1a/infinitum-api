import { KickParticipantFromProjectUseCase } from "@modules/project/use-cases";
import {
  CannotKickOwnerOfProjectError,
  CannotKickYourselfError,
} from "@modules/project/use-cases/errors";
import {
  ICannotKickOwnerOfProjectErrorLanguage,
  ICannotKickYourselfErrorLanguage,
} from "@modules/project/use-cases/interfaces/languages";
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
import {
  IKickedAdminTemplateLanguage,
  IKickedTemplateLanguage,
} from "../interfaces/languages";
import { IFindAllEmailsOfOwnersAndAdminsOfProjectRepository } from "../interfaces/repositories";
import { KickParticipantFromProjectController } from "./KickParticipantFromProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const cannotKickOwnerOfProjectErrorLanguageMock =
  mock<ICannotKickOwnerOfProjectErrorLanguage>();
const cannotKickYourselfErrorLanguageMock =
  mock<ICannotKickYourselfErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const kickParticipantFromProjectUseCaseMock =
    mock<KickParticipantFromProjectUseCase>();
  const findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock =
    mock<IFindAllEmailsOfOwnersAndAdminsOfProjectRepository>();
  const notifyUserNotificationServiceMock = mock<INotificationService>();
  const notifyAdminsNotificationServiceMock = mock<INotificationService>();
  const kickedTemplateLanguageMock = mock<IKickedTemplateLanguage>();
  const kickedAdminTemplateLanguageMock = mock<IKickedAdminTemplateLanguage>();
  const validationMock = mock<IValidation>();
  const sut = new KickParticipantFromProjectController(
    kickParticipantFromProjectUseCaseMock,
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
    validationMock,
    notifyUserNotificationServiceMock,
    notifyAdminsNotificationServiceMock,
    kickedTemplateLanguageMock,
    kickedAdminTemplateLanguageMock
  );

  return {
    sut,
    kickParticipantFromProjectUseCaseMock,
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
    validationMock,
    notifyUserNotificationServiceMock,
    notifyAdminsNotificationServiceMock,
    kickedTemplateLanguageMock,
    kickedAdminTemplateLanguageMock,
  };
}

describe("kickParticipantFromProject controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(2);

    const {
      sut,
      kickParticipantFromProjectUseCaseMock,
      findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock.findAllEmailsOfOwnersAndAdmins.mockResolvedValueOnce(
      [givenRequest.accountEmailMakingRequest]
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(kickParticipantFromProjectUseCaseMock.kick).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should call notifyUserNotificationService", async () => {
    expect.assertions(1);

    const {
      sut,
      findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
      notifyUserNotificationServiceMock,
      kickedTemplateLanguageMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock.findAllEmailsOfOwnersAndAdmins.mockResolvedValueOnce(
      [givenRequest.accountEmailMakingRequest]
    );

    await sut.handleRequest(givenRequest);

    expect(notifyUserNotificationServiceMock.notify).toHaveBeenNthCalledWith(
      1,
      givenRequest.accountEmail,
      {
        projectId: givenRequest.projectId,
        kickedTemplateLanguage: kickedTemplateLanguageMock,
      }
    );
  });

  it("should call notifyAdminsNotificationServiceMock", async () => {
    expect.assertions(1);

    const {
      sut,
      findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
      notifyAdminsNotificationServiceMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock.findAllEmailsOfOwnersAndAdmins.mockResolvedValueOnce(
      [givenRequest.accountEmailMakingRequest, "alan@email.com"]
    );

    await sut.handleRequest(givenRequest);

    expect(notifyAdminsNotificationServiceMock.notify).toHaveBeenCalled();
  });

  it("shouldn't call notifyAdminsNotificationServiceMock on the account email making request", async () => {
    expect.assertions(2);

    const {
      sut,
      findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
      notifyAdminsNotificationServiceMock,
      kickedAdminTemplateLanguageMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock.findAllEmailsOfOwnersAndAdmins.mockResolvedValueOnce(
      [givenRequest.accountEmailMakingRequest, "alan@email.com"]
    );

    await sut.handleRequest(givenRequest);

    expect(notifyAdminsNotificationServiceMock.notify).not.toHaveBeenCalledWith(
      givenRequest.accountEmailMakingRequest,
      {
        projectId: givenRequest.projectId,
        emailKicked: givenRequest.accountEmail,
        kickedAdminTemplateLanguage: kickedAdminTemplateLanguageMock,
      }
    );
    expect(notifyAdminsNotificationServiceMock.notify).toHaveBeenCalledTimes(1);
  });

  it("shouldn't call notifyAdminsNotificationServiceMock on the account being kicked, even if they're an admin", async () => {
    expect.assertions(1);

    const {
      sut,
      findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock,
      notifyAdminsNotificationServiceMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    findAllEmailsOfOwnersAndAdminsOfProjectRepositoryMock.findAllEmailsOfOwnersAndAdmins.mockResolvedValueOnce(
      [givenRequest.accountEmail]
    );

    await sut.handleRequest(givenRequest);

    expect(notifyAdminsNotificationServiceMock.notify).toHaveBeenCalledTimes(0);
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    const errorThrown = new ProjectNotFoundError(
      projectNotFoundErrorLanguageMock
    );
    kickParticipantFromProjectUseCaseMock.kick.mockImplementationOnce(() => {
      throw errorThrown;
    });
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errorThrown = new NotParticipantInProjectError(
      givenRequest.accountEmail,
      notParticipantInProjectErrorLanguageMock
    );
    kickParticipantFromProjectUseCaseMock.kick.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest if CannotKickOwnerOfProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errorThrown = new CannotKickOwnerOfProjectError(
      cannotKickOwnerOfProjectErrorLanguageMock
    );
    kickParticipantFromProjectUseCaseMock.kick.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest if CannotKickYourselfError is thrown", async () => {
    expect.assertions(2);

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const errorThrown = new CannotKickYourselfError(
      cannotKickYourselfErrorLanguageMock
    );
    kickParticipantFromProjectUseCaseMock.kick.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errorThrown = new RoleInsufficientPermissionError(
      "user-role",
      roleInsufficientPermissionErrorLanguageMock
    );
    kickParticipantFromProjectUseCaseMock.kick.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    kickParticipantFromProjectUseCaseMock.kick.mockImplementationOnce(() => {
      throw new Error("unhandled server side error");
    });
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
