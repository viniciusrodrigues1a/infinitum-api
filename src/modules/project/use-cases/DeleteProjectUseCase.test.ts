import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "@shared/use-cases/interfaces/repositories";
import { mock } from "jest-mock-extended";
import { DeleteProjectUseCase } from "./DeleteProjectUseCase";
import { IDeleteProjectRepository } from "./interfaces/repositories";

function makeSut() {
  const deleteProjectRepositoryMock = mock<IDeleteProjectRepository>();
  const doesProjectExistRepositoryMock = mock<IDoesProjectExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const sut = new DeleteProjectUseCase(
    deleteProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock
  );

  return {
    sut,
    deleteProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
  };
}

describe("deleteProject use-case", () => {
  it("should delete a project", async () => {
    expect.assertions(1);

    const {
      sut,
      deleteProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    const projectId = "project-id-0";

    await sut.delete({
      accountEmailMakingRequest: "jorge@email.com",
      projectId,
    });

    expect(deleteProjectRepositoryMock.deleteProject).toHaveBeenNthCalledWith(
      1,
      projectId
    );
  });

  it("should throw ProjectNotFoundError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    const projectId = "project-id-0";

    const when = () =>
      sut.delete({ accountEmailMakingRequest: "jorge@email.com", projectId });

    await expect(when).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );
    const accountEmail = "jorge@email.com";

    const when = () =>
      sut.delete({
        accountEmailMakingRequest: accountEmail,
        projectId: "project-id-0",
      });

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });
});
