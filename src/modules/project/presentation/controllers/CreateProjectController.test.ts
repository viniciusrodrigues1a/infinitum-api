import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { CreateProjectUseCase } from "@modules/project/use-cases";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IMissingParamsErrorLanguage } from "@shared/presentation/interfaces/languages";
import { mock } from "jest-mock-extended";
import {
  CreateProjectController,
  CreateProjectControllerRequest,
} from "./CreateProjectController";
import { ICreateProjectControllerLanguage } from "./interfaces/languages";

const accountNotFoundErrorLanguageMock = mock<IAccountNotFoundErrorLanguage>();
accountNotFoundErrorLanguageMock.getAccountNotFoundErrorMessage.mockReturnValue(
  "mocked error message"
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
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(2);

    const { sut, createProjectUseCaseMock } = makeSut();
    const givenProject = {
      name: "my project",
      description: "my project's description",
      accountEmailRequestingCreation: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
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
      accountEmailRequestingCreation: "jorge@email.com",
    };
    createProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });

  it("should return HttpStatusCodes.badRequest if AccountNotFoundError is thrown", async () => {
    expect.assertions(2);

    const { sut, createProjectUseCaseMock } = makeSut();
    const givenProject = {
      name: "my project",
      description: "my project's description",
      accountEmailRequestingCreation: "jorge@email.com",
    };
    createProjectUseCaseMock.create.mockImplementationOnce(() => {
      throw new AccountNotFoundError(
        givenProject.accountEmailRequestingCreation,
        accountNotFoundErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(AccountNotFoundError);
  });

  it("should return HttpStatusCodes.badRequest if name is missing", async () => {
    expect.assertions(2);

    const { sut, createProjectControllerLanguageMock } = makeSut();
    const givenProject = {
      description: "my project's description",
      accountEmailRequestingCreation: "jorge@email.com",
    } as CreateProjectControllerRequest;

    const response = await sut.handleRequest(givenProject);

    const expectedParamsMissing = [
      createProjectControllerLanguageMock.getMissingParamsErrorNameParamMessage(),
    ];
    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body.params).toStrictEqual(expectedParamsMissing);
  });
});
