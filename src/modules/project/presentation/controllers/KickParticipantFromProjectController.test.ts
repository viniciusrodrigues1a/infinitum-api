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
  const validationMock = mock<IValidation>();
  const sut = new KickParticipantFromProjectController(
    kickParticipantFromProjectUseCaseMock,
    validationMock
  );

  return { sut, kickParticipantFromProjectUseCaseMock, validationMock };
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

    const { sut, kickParticipantFromProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(kickParticipantFromProjectUseCaseMock.kick).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
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
