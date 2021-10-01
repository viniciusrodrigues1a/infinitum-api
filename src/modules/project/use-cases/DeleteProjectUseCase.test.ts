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
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import * as RoleModule from "../entities/value-objects";
import { DeleteProjectUseCase } from "./DeleteProjectUseCase";
import {
  IDeleteProjectRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";

jest.mock("../entities/value-objects/Role");

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
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new DeleteProjectUseCase(
    deleteProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    deleteProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock,
  };
}

describe("deleteProject use-case", () => {
  beforeEach(() => {
    const roleSpy = jest.spyOn(RoleModule, "Role");
    roleSpy.mockImplementationOnce(
      (name: string) =>
        ({
          name: name as unknown,
          permissions: [],
          can() {
            return this.name === ("roleWithPermission" as unknown);
          },
        } as RoleModule.Role)
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should delete a project", async () => {
    expect.assertions(1);

    const {
      sut,
      deleteProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
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
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
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
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    const accountEmail = "jorge@email.com";

    const when = () =>
      sut.delete({
        accountEmailMakingRequest: accountEmail,
        projectId: "project-id-0",
      });

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should throw RoleInsufficientPermissionError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const accountEmail = "jorge@email.com";

    const when = () =>
      sut.delete({
        accountEmailMakingRequest: accountEmail,
        projectId: "project-id-0",
      });

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });
});
