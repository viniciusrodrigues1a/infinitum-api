import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";
import { mock } from "jest-mock-extended";
import { CreateProjectUseCase } from "./CreateProjectUseCase";
import { ICreateProjectRepository } from "./interfaces/repositories";

function makeSut() {
  const createProjectRepositoryMock = mock<ICreateProjectRepository>();
  const doesAccountExistRepositoryMock = mock<IDoesAccountExistRepository>();
  const accountNotFoundErrorLanguageMock =
    mock<IAccountNotFoundErrorLanguage>();
  accountNotFoundErrorLanguageMock.getAccountNotFoundErrorMessage.mockReturnValue(
    "mocked error message"
  );
  const sut = new CreateProjectUseCase(
    createProjectRepositoryMock,
    doesAccountExistRepositoryMock,
    accountNotFoundErrorLanguageMock
  );

  return {
    sut,
    createProjectRepositoryMock,
    doesAccountExistRepositoryMock,
    accountNotFoundErrorLanguageMock,
  };
}

describe("createProject use-case", () => {
  it("should create a Project", async () => {
    expect.assertions(1);

    const { sut, createProjectRepositoryMock, doesAccountExistRepositoryMock } =
      makeSut();
    const project = {
      name: "my project",
      description: "my project's description",
      accountEmailRequestingCreation: "jorge@email.com",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);

    await sut.create(project);

    expect(createProjectRepositoryMock.createProject).toHaveBeenNthCalledWith(
      1,
      project
    );
  });

  it("should throw AccountNotFoundError if account doesn't exist", async () => {
    expect.assertions(1);

    const {
      sut,
      doesAccountExistRepositoryMock,
      accountNotFoundErrorLanguageMock,
    } = makeSut();
    const project = {
      name: "my project",
      description: "my project's description",
      accountEmailRequestingCreation: "jorge@email.com",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.create(project);

    await expect(when).rejects.toThrow(
      new AccountNotFoundError(
        project.accountEmailRequestingCreation,
        accountNotFoundErrorLanguageMock
      )
    );
  });
});
