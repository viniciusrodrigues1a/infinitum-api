import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { CreateProjectUseCase } from "@modules/project/use-cases";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { CreateProjectController } from "./CreateProjectController";

const accountNotFoundErrorLanguageMock = mock<IAccountNotFoundErrorLanguage>();
accountNotFoundErrorLanguageMock.getAccountNotFoundErrorMessage.mockReturnValue(
  "mocked error message"
);

function makeSut() {
  const createProjectUseCaseMock = mock<CreateProjectUseCase>();
  const sut = new CreateProjectController(createProjectUseCaseMock);

  return { sut, createProjectUseCaseMock };
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
});
