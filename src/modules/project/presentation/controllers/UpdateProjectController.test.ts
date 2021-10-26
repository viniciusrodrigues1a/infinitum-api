import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { UpdateProjectUseCase } from "@modules/project/use-cases";
import { NotFutureDateError } from "@shared/entities/errors";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IValidation } from "@shared/presentation/validation";
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
import { UpdateProjectController } from "./UpdateProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();
const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
const beginsAtMustBeBeforeFinishesAtErrorLanguageMock =
  mock<IBeginsAtMustBeBeforeFinishesAtErrorLanguage>();

function makeSut() {
  const updateProjectUseCaseMock = mock<UpdateProjectUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new UpdateProjectController(
    updateProjectUseCaseMock,
    validationMock
  );

  return {
    sut,
    updateProjectUseCaseMock,
    validationMock,
  };
}

describe("updateProject controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(updateProjectUseCaseMock.updateProject).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
    };
    const errorThrown = new ProjectNotFoundError(
      projectNotFoundErrorLanguageMock
    );
    updateProjectUseCaseMock.updateProject.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.unauthorized if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
    };
    const errorThrown = new NotParticipantInProjectError(
      givenRequest.accountEmailMakingRequest,
      notParticipantInProjectErrorLanguageMock
    );
    updateProjectUseCaseMock.updateProject.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest if NotFutureDateError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const yesterday = new Date(new Date().getTime() - 86400 * 1000);
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
      finishesAt: yesterday.toISOString(),
    };
    const errorThrown = new NotFutureDateError(
      yesterday,
      notFutureDateErrorLanguageMock
    );
    updateProjectUseCaseMock.updateProject.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest if BeginsAtMustBeBeforeFinishesAtError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const yesterday = new Date(new Date().getTime() - 86400 * 1000);
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
      beginsAt: new Date().toISOString(),
      finishesAt: yesterday.toISOString(),
    };
    const errorThrown = new BeginsAtMustBeBeforeFinishesAtError(
      beginsAtMustBeBeforeFinishesAtErrorLanguageMock
    );
    updateProjectUseCaseMock.updateProject.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(2);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
    };
    const errorThrown = new RoleInsufficientPermissionError(
      "role",
      roleInsufficientPermissionErrorLanguageMock
    );
    updateProjectUseCaseMock.updateProject.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
    expect(response.body).toBe(errorThrown);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, updateProjectUseCaseMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      name: "Updated project name",
    };
    updateProjectUseCaseMock.updateProject.mockImplementationOnce(() => {
      throw new Error("unhandled server-side error");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
