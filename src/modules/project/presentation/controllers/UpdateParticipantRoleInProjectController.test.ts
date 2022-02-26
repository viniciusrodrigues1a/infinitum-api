import { InvalidRoleNameError } from "@modules/project/entities/errors";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { UpdateParticipantRoleInProjectUseCase } from "@modules/project/use-cases";
import {
  CannotUpdateRoleOfOwnerError,
  CannotUpdateRoleToOwnerError,
  CannotUpdateYourOwnRoleError,
} from "@modules/project/use-cases/errors";
import {
  ICannotUpdateRoleOfOwnerErrorLanguage,
  ICannotUpdateRoleToOwnerErrorLanguage,
  ICannotUpdateYourOwnRoleErrorLanguage,
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
import { IRoleUpdatedTemplateLanguage } from "../interfaces/languages";
import { IFindProjectNameByProjectIdRepository } from "../interfaces/repositories";
import { UpdateParticipantRoleInProjectController } from "./UpdateParticipantRoleInProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const invalidRoleNameErrorLanguageMock = mock<IInvalidRoleNameErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();
const cannotUpdateRoleToOwnerErrorLanguageMock =
  mock<ICannotUpdateRoleToOwnerErrorLanguage>();
const cannotUpdateYourOwnRoleErrorLanguageMock =
  mock<ICannotUpdateYourOwnRoleErrorLanguage>();
const cannotUpdateRoleOfOwnerErrorLanguageMock =
  mock<ICannotUpdateRoleOfOwnerErrorLanguage>();

function makeSut() {
  const updateParticipantRoleInProjectUseCaseMock =
    mock<UpdateParticipantRoleInProjectUseCase>();
  const validationMock = mock<IValidation>();
  const notificationServiceMock = mock<INotificationService>();
  const roleUpdatedTemplateLanguageMock = mock<IRoleUpdatedTemplateLanguage>();
  const sut = new UpdateParticipantRoleInProjectController(
    updateParticipantRoleInProjectUseCaseMock,
    validationMock,
    notificationServiceMock,
    roleUpdatedTemplateLanguageMock
  );

  return {
    sut,
    notificationServiceMock,
    roleUpdatedTemplateLanguageMock,
    updateParticipantRoleInProjectUseCaseMock,
    validationMock,
  };
}

describe("updateParticipantRoleInProject controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      roleName: "member",
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

  it("should return HttpStatusCodes.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      updateParticipantRoleInProjectUseCaseMock.updateParticipantRole
    ).toHaveBeenNthCalledWith(1, givenRequest);
  });

  it("should call notificationServiceMock", async () => {
    expect.assertions(1);

    const { sut, notificationServiceMock, roleUpdatedTemplateLanguageMock } =
      makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };

    await sut.handleRequest(givenRequest);

    expect(notificationServiceMock.notify).toHaveBeenNthCalledWith(
      1,
      givenRequest.accountEmail,
      {
        projectId: givenRequest.projectId,
        roleName: givenRequest.roleName,
        roleUpdatedTemplateLanguage: roleUpdatedTemplateLanguageMock,
      }
    );
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new ProjectNotFoundError(
      projectNotFoundErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new NotParticipantInProjectError(
      givenRequest.accountEmail,
      notParticipantInProjectErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.badRequest if CannotUpdateRoleToOwnerError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new CannotUpdateRoleToOwnerError(
      cannotUpdateRoleToOwnerErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.badRequest if CannotUpdateYourOwnRoleError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new CannotUpdateYourOwnRoleError(
      cannotUpdateYourOwnRoleErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.badRequest if CannotUpdateRoleOfOwnerError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new CannotUpdateRoleOfOwnerError(
      cannotUpdateRoleOfOwnerErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.badRequest if InvalidRoleNameError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "invalid-role-name",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new InvalidRoleNameError(
      givenRequest.roleName,
      invalidRoleNameErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errThrown = new RoleInsufficientPermissionError(
      "user-role",
      roleInsufficientPermissionErrorLanguageMock
    );
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw errThrown;
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBe(errThrown);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, updateParticipantRoleInProjectUseCaseMock } = makeSut();
    const givenRequest = {
      roleName: "member",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    updateParticipantRoleInProjectUseCaseMock.updateParticipantRole.mockImplementationOnce(
      () => {
        throw new Error("unhandled server-side error");
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
