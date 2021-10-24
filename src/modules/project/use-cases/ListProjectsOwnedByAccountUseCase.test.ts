import { mock } from "jest-mock-extended";
import { Project } from "../entities";
import { IListProjectsOwnedByAccountRepository } from "./interfaces/repositories";
import { ListProjectsOwnedByAccountUseCase } from "./ListProjectsOwnedByAccountUseCase";

function makeSut() {
  const listProjectsOwnedByAccountRepositoryMock =
    mock<IListProjectsOwnedByAccountRepository>();
  const sut = new ListProjectsOwnedByAccountUseCase(
    listProjectsOwnedByAccountRepositoryMock
  );

  return {
    sut,
    listProjectsOwnedByAccountRepositoryMock,
  };
}

describe("listProjectsOwnedByAccount use-case", () => {
  it("should be able to list all projects owned by given account", async () => {
    expect.assertions(2);

    const { sut, listProjectsOwnedByAccountRepositoryMock } = makeSut();
    const givenEmail = "jorge@email.com";
    const mockedProjects = [{ projectId: "id-0" } as Project];
    listProjectsOwnedByAccountRepositoryMock.listProjects.mockResolvedValueOnce(
      mockedProjects
    );

    const projects = await sut.list(givenEmail);

    expect(projects).toStrictEqual(mockedProjects);
    expect(
      listProjectsOwnedByAccountRepositoryMock.listProjects
    ).toHaveBeenCalledWith(givenEmail);
  });
});
