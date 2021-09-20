import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { mock } from "jest-mock-extended";
import { CreateProjectUseCase } from "./CreateProjectUseCase";
import { ICreateProjectRepository } from "./interfaces/repositories";
import { Project } from "../entities/Project";

jest.mock("../entities/Project");

function makeSut() {
  const createProjectRepositoryMock = mock<ICreateProjectRepository>();
  const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
  notFutureDateErrorLanguageMock.getNotFutureDateErrorMessage.mockReturnValue(
    "mocked date err msg"
  );
  const sut = new CreateProjectUseCase(
    createProjectRepositoryMock,
    notFutureDateErrorLanguageMock
  );

  return {
    sut,
    createProjectRepositoryMock,
    notFutureDateErrorLanguageMock,
  };
}

describe("createProject use-case", () => {
  it("should create a Project", async () => {
    expect.assertions(1);

    const { sut, createProjectRepositoryMock } = makeSut();
    const project = {
      name: "my project",
      description: "my project's description",
      accountEmailMakingRequest: "jorge@email.com",
    };

    await sut.create(project);

    expect(createProjectRepositoryMock.createProject).toHaveBeenCalledTimes(1);
  });

  it("should instantiate Project", async () => {
    expect.assertions(1);

    const { sut } = makeSut();
    const project = {
      name: "my project",
      description: "my project's description",
      accountEmailMakingRequest: "jorge@email.com",
    };

    await sut.create(project);

    expect(Project).toHaveBeenCalledTimes(1);
  });
});
