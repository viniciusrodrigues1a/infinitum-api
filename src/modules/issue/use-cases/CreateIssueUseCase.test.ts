import { mock } from "jest-mock-extended";
import {
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueGroupIdRepository,
  IHasProjectBegunRepository,
  IIsProjectArchivedRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import * as RoleModule from "@modules/project/entities/value-objects";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import {
  IProjectHasntBegunErrorLanguage,
  IProjectIsArchivedErrorLanguage,
} from "@modules/project/use-cases/interfaces/languages";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
import { ICreateIssueRepository } from "./interfaces/repositories";
import { CreateIssueUseCase } from "./CreateIssueUseCase";
import { Issue } from "../entities";

jest.mock("../../project/entities/value-objects/Role");
jest.mock("../entities/Issue");

function makeSut() {
  const createIssueRepositoryMock = mock<ICreateIssueRepository>();
  const findProjectIdByIssueGroupIdRepositoryMock =
    mock<IFindProjectIdByIssueGroupIdRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const hasProjectBegunRepositoryMock = mock<IHasProjectBegunRepository>();
  const isProjectArchivedRepositoryMock = mock<IIsProjectArchivedRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const projectHasntBegunErrorLanguageMock =
    mock<IProjectHasntBegunErrorLanguage>();
  const projectIsArchivedErrorLanguageMock =
    mock<IProjectIsArchivedErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new CreateIssueUseCase(
    createIssueRepositoryMock,
    findProjectIdByIssueGroupIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    hasProjectBegunRepositoryMock,
    isProjectArchivedRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    projectHasntBegunErrorLanguageMock,
    projectIsArchivedErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    createIssueRepositoryMock,
    findProjectIdByIssueGroupIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    hasProjectBegunRepositoryMock,
    isProjectArchivedRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
  };
}
describe("createIssue use-case", () => {
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

  it("should create an issue", async () => {
    expect.assertions(1);

    const {
      sut,
      createIssueRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasProjectBegunRepositoryMock,
      isProjectArchivedRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    hasProjectBegunRepositoryMock.hasProjectBegun.mockResolvedValueOnce(true);
    isProjectArchivedRepositoryMock.isProjectArchived.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.create(givenIssue);

    expect(createIssueRepositoryMock.createIssue).toHaveBeenCalledTimes(1);
  });

  it("should throw ProjectNotFoundError if project cannot be found", async () => {
    expect.assertions(1);

    const { sut, findProjectIdByIssueGroupIdRepositoryMock } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.create(givenIssue);

    await expect(when).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if account doesn't participate in project", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.create(givenIssue);

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should throw ProjectHasntBegunError", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasProjectBegunRepositoryMock,
    } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    hasProjectBegunRepositoryMock.hasProjectBegun.mockResolvedValueOnce(false);

    const when = () => sut.create(givenIssue);

    await expect(when).rejects.toBeInstanceOf(ProjectHasntBegunError);
  });

  it("should throw ProjectIsArchivedError", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasProjectBegunRepositoryMock,
      isProjectArchivedRepositoryMock,
    } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    hasProjectBegunRepositoryMock.hasProjectBegun.mockResolvedValueOnce(true);
    isProjectArchivedRepositoryMock.isProjectArchived.mockResolvedValueOnce(
      true
    );

    const when = () => sut.create(givenIssue);

    await expect(when).rejects.toBeInstanceOf(ProjectIsArchivedError);
  });

  it("should throw RoleInsufficientPermissionError", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasProjectBegunRepositoryMock,
      isProjectArchivedRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    hasProjectBegunRepositoryMock.hasProjectBegun.mockResolvedValueOnce(true);
    isProjectArchivedRepositoryMock.isProjectArchived.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const when = () => sut.create(givenIssue);

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should instantiate Issue", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasProjectBegunRepositoryMock,
      isProjectArchivedRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenIssue = {
      issueGroupId: "ig-id-0",
      title: "My issue",
      description: "My issue's description",
      accountEmailMakingRequest: "jorge@email.com",
    };
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    hasProjectBegunRepositoryMock.hasProjectBegun.mockResolvedValueOnce(true);
    isProjectArchivedRepositoryMock.isProjectArchived.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.create(givenIssue);

    expect(Issue).toHaveBeenCalledTimes(1);
  });
});
