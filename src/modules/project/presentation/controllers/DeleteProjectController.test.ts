import { DeleteProjectUseCase } from "@modules/project/use-cases";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import { DeleteProjectController } from "./DeleteProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const deleteProjectUseCaseMock = mock<DeleteProjectUseCase>();
  const sut = new DeleteProjectController(deleteProjectUseCaseMock);

  return { sut, deleteProjectUseCaseMock };
}

describe("deleteProject controller", () => {
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(deleteProjectUseCaseMock.delete).toHaveBeenNthCalledWith(
      1,
      givenRequest
    );
  });

  it("should return HttpStatusCodes.notFound if useCase throws ProjectNotFoundError", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    const projectId = "project-id-0";
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(
        projectId,
        projectNotFoundErrorLanguageMock
      );
    });

    const response = await sut.handleRequest({
      projectId,
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if useCase throws NotParticipantInProjectError", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    const accountEmail = "jorge@email.com";
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        accountEmail,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest({
      projectId: "project-id-0",
      accountEmailMakingRequest: accountEmail,
    });

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should return HttpStatusCodes.unauthorized if useCase throws RoleInsufficientPermissionError", async () => {
    expect.assertions(2);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest({
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should return HttpStatusCodes.serverError if useCase throws an unhandled error", async () => {
    expect.assertions(1);

    const { sut, deleteProjectUseCaseMock } = makeSut();
    deleteProjectUseCaseMock.delete.mockImplementationOnce(() => {
      throw new Error("unhandled internal error");
    });

    const response = await sut.handleRequest({
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
