import { RevokeInvitationUseCase } from "@modules/project/use-cases";
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
import { RevokeInvitationController } from "./RevokeInvitationController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const revokeInvitationUseCaseMock = mock<RevokeInvitationUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new RevokeInvitationController(
    revokeInvitationUseCaseMock,
    validationMock
  );

  return { sut, revokeInvitationUseCaseMock, validationMock };
}

describe("revokeInvitation controller", () => {
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

    const { sut, revokeInvitationUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      revokeInvitationUseCaseMock.revokeInvitation
    ).toHaveBeenNthCalledWith(1, givenRequest);
  });

  it("should return HttpStatusCodes.notFound and body with a ProjectNotFoundError", async () => {
    expect.assertions(2);

    const { sut, revokeInvitationUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errorThrown = new ProjectNotFoundError(
      projectNotFoundErrorLanguageMock
    );
    revokeInvitationUseCaseMock.revokeInvitation.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest and body with a NotParticipantInProjectError", async () => {
    expect.assertions(2);

    const { sut, revokeInvitationUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errorThrown = new NotParticipantInProjectError(
      givenRequest.accountEmailMakingRequest,
      notParticipantInProjectErrorLanguageMock
    );
    revokeInvitationUseCaseMock.revokeInvitation.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.unauthorized and body with a RoleInsufficientPermissionError", async () => {
    expect.assertions(2);

    const { sut, revokeInvitationUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    const errorThrown = new RoleInsufficientPermissionError(
      "user-role",
      roleInsufficientPermissionErrorLanguageMock
    );
    revokeInvitationUseCaseMock.revokeInvitation.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.serverError", async () => {
    expect.assertions(1);

    const { sut, revokeInvitationUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    revokeInvitationUseCaseMock.revokeInvitation.mockImplementationOnce(() => {
      throw new Error("unhandled server side error");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
