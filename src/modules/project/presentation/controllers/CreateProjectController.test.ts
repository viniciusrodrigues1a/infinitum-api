import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { CreateProjectUseCase } from "@modules/project/use-cases";
import { NotFutureDateError } from "@shared/entities/errors";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IMissingParamsErrorLanguage } from "@shared/presentation/interfaces/languages";
import { mock } from "jest-mock-extended";
import {
  CreateProjectController,
  CreateProjectControllerRequest,
} from "./CreateProjectController";
import { ICreateProjectControllerLanguage } from "./interfaces/languages";

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
  const createProjectControllerLanguageMock =
    mock<ICreateProjectControllerLanguage>();
  createProjectControllerLanguageMock.getMissingParamsErrorNameParamMessage.mockReturnValue(
    "name"
  );
  createProjectControllerLanguageMock.getMissingParamsErrorDescriptionParamMessage.mockReturnValue(
    "description"
  );
  const missingParamsErrorLanguageMock = mock<IMissingParamsErrorLanguage>();
  missingParamsErrorLanguageMock.getMissingParamsErrorMessage.mockReturnValue(
    "mocked missingParams message"
  );
  const sut = new CreateProjectController(
    createProjectUseCaseMock,
    createProjectControllerLanguageMock,
    missingParamsErrorLanguageMock
  );

  return {
    sut,
    createProjectUseCaseMock,
    createProjectControllerLanguageMock,
    missingParamsErrorLanguageMock,
  };
}

describe("createProject controller", () => {
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

  it("should return HttpStatusCodes.badRequest if name is not a string", async () => {
    expect.assertions(2);

    const { sut, createProjectControllerLanguageMock } = makeSut();
    const givenProject = {
      name: new Date() as unknown,
      description: "my project's description",
      accountEmailMakingRequest: "jorge@email.com",
    } as CreateProjectControllerRequest;

    const response = await sut.handleRequest(givenProject);

    const expectedParamsMissing = [
      createProjectControllerLanguageMock.getMissingParamsErrorNameParamMessage(),
    ];
    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body.params).toStrictEqual(expectedParamsMissing);
  });

  it("should return HttpStatusCodes.badRequest if description is not a string", async () => {
    expect.assertions(2);

    const { sut, createProjectControllerLanguageMock } = makeSut();
    const givenProject = {
      name: "my project",
      description: 12345 as unknown,
      accountEmailMakingRequest: "jorge@email.com",
    } as CreateProjectControllerRequest;

    const response = await sut.handleRequest(givenProject);

    const expectedParamsMissing = [
      createProjectControllerLanguageMock.getMissingParamsErrorDescriptionParamMessage(),
    ];
    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body.params).toStrictEqual(expectedParamsMissing);
  });

  it("should return HttpStatusCodes.badRequest if name AND description are not a string", async () => {
    expect.assertions(2);

    const { sut, createProjectControllerLanguageMock } = makeSut();
    const givenProject = {
      name: 123 as unknown,
      description: [1, 2] as unknown,
      accountEmailMakingRequest: "jorge@email.com",
    } as CreateProjectControllerRequest;

    const response = await sut.handleRequest(givenProject);

    const expectedParamsMissing = [
      createProjectControllerLanguageMock.getMissingParamsErrorNameParamMessage(),
      createProjectControllerLanguageMock.getMissingParamsErrorDescriptionParamMessage(),
    ];
    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body.params).toStrictEqual(expectedParamsMissing);
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
