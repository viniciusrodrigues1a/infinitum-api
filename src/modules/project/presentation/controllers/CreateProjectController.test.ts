import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "@modules/project/entities/interfaces/languages";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
} from "@modules/project/use-cases";
import { NotFutureDateError } from "@shared/entities/errors";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IValidation } from "@shared/presentation/validation";
import { mock } from "jest-mock-extended";
import {
  CreateProjectController,
  CreateProjectControllerRequest,
} from "./CreateProjectController";

const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
notFutureDateErrorLanguageMock.getNotFutureDateErrorMessage.mockReturnValue(
  "mocked date err msg"
);
const beginsAtMustBeBeforeFinishesAtErrorLanguageMock =
  mock<IBeginsAtMustBeBeforeFinishesAtErrorLanguage>();
beginsAtMustBeBeforeFinishesAtErrorLanguageMock.getBeginsAtMustBeBeforeFinishesAtErrorMessage.mockReturnValue(
  "mocked err message"
);

function makeSut() {
  const createProjectUseCaseMock = mock<CreateProjectUseCase>();
  const createIssueGroupForProjectUseCaseMock =
    mock<CreateIssueGroupForProjectUseCase>();
  const validationMock = mock<IValidation>();
  const sut = new CreateProjectController(
    createProjectUseCaseMock,
    createIssueGroupForProjectUseCaseMock,
    validationMock
  );

  return {
    sut,
    createProjectUseCaseMock,
    validationMock,
  };
}

describe("createProject controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenProject = {
      name: "my project",
      description: "my project's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.created with the project id", async () => {
    expect.assertions(3);

    const { sut, createProjectUseCaseMock } = makeSut();
    const givenProject = {
      name: "my project",
      description: "my project's description",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.created);
    expect(response.body).toHaveProperty("id");
    expect(createProjectUseCaseMock.create).toHaveBeenNthCalledWith(
      1,
      givenProject
    );
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, createProjectUseCaseMock } = makeSut();
    const givenProject = {
      name: "my project",
      description: "my project's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    createProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });

  it("should return HttpStatusCodes.badRequest if NotFutureDateError is thrown", async () => {
    expect.assertions(2);

    const { sut, createProjectUseCaseMock } = makeSut();
    const nowMs = new Date().getTime();
    const finishesAt = new Date(nowMs - 86400 * 1000);
    const givenProject = {
      name: "my project",
      description: "my project's description",
      finishesAt: finishesAt.toISOString(),
      accountEmailMakingRequest: "jorge@email.com",
    } as CreateProjectControllerRequest;
    const errorThrown = new NotFutureDateError(
      finishesAt,
      notFutureDateErrorLanguageMock
    );
    createProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toStrictEqual(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest if BeginsAtMustBeBeforeFinishesAtError is thrown", async () => {
    expect.assertions(2);

    const { sut, createProjectUseCaseMock } = makeSut();
    const nowMs = new Date().getTime();
    const finishesAt = new Date(nowMs - 86400 * 1000);
    const givenProject = {
      name: "my project",
      description: "my project's description",
      finishesAt: finishesAt.toISOString(),
      accountEmailMakingRequest: "jorge@email.com",
    } as CreateProjectControllerRequest;
    const errorThrown = new BeginsAtMustBeBeforeFinishesAtError(
      beginsAtMustBeBeforeFinishesAtErrorLanguageMock
    );
    createProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toStrictEqual(errorThrown);
  });
});
