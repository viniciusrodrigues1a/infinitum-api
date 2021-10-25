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
import { CreateIssueGroupForProjectUseCase } from "./CreateIssueGroupForProjectUseCase";
import {
  ICreateIssueGroupForProjectRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";

jest.mock("../entities/value-objects/Role");

function makeSut() {
  const doesProjectExistRepositoryMock = mock<IDoesProjectExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const createIssueGroupForProjectRepositoryMock =
    mock<ICreateIssueGroupForProjectRepository>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new CreateIssueGroupForProjectUseCase(
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    createIssueGroupForProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    createIssueGroupForProjectRepositoryMock,
  };
}

describe("createIssueGroupForProject use-case", () => {
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

  it("should create an IssueGroup", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
      createIssueGroupForProjectRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.create({
      projectId: "project-id-0",
      title: "In progress",
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(
      createIssueGroupForProjectRepositoryMock.createIssueGroup
    ).toHaveBeenCalledTimes(1);
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

    const when = () =>
      sut.create({
        projectId: "project-id-0",
        title: "In progress",
        accountEmailMakingRequest: "jorge@email.com",
      });

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

    const when = () =>
      sut.create({
        projectId: "project-id-0",
        title: "In progress",
        accountEmailMakingRequest: "jorge@email.com",
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

    const when = () =>
      sut.create({
        projectId: "project-id-0",
        title: "In progress",
        accountEmailMakingRequest: "jorge@email.com",
      });

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });
});
