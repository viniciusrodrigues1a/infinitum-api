import {
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueIdRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import * as RoleModule from "@modules/project/entities/value-objects";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { DeleteIssueUseCase } from "./DeleteIssueUseCase";
import { IssueNotFoundError } from "./errors";
import { IIssueNotFoundErrorLanguage } from "./interfaces/languages";
import {
  IDeleteIssueRepository,
  IDoesIssueExistRepository,
} from "./interfaces/repositories";

jest.mock("../../project/entities/value-objects/Role");

function makeSut() {
  const deleteIssueRepositoryMock = mock<IDeleteIssueRepository>();
  const doesIssueExistRepositoryMock = mock<IDoesIssueExistRepository>();
  const findProjectIdByIssueIdRepositoryMock =
    mock<IFindProjectIdByIssueIdRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new DeleteIssueUseCase(
    deleteIssueRepositoryMock,
    doesIssueExistRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    issueNotFoundErrorLanguageMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    deleteIssueRepositoryMock,
    doesIssueExistRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
  };
}

describe("deleteIssue use-case", () => {
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

  it("should call the repository", async () => {
    expect.assertions(1);

    const {
      sut,
      deleteIssueRepositoryMock,
      doesIssueExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      givenRequest.issueId
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.delete(givenRequest);

    expect(deleteIssueRepositoryMock.deleteIssue).toHaveBeenNthCalledWith(
      1,
      givenRequest.issueId
    );
  });

  it("should throw IssueNotFoundError if issue cannot be found", async () => {
    expect.assertions(1);

    const { sut, doesIssueExistRepositoryMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(false);

    const when = () => sut.delete(givenRequest);

    await expect(when).rejects.toThrow(IssueNotFoundError);
  });

  it("should throw ProjectNotFoundError if project cannot be found", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.delete(givenRequest);

    await expect(when).rejects.toThrow(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if account doesn't participate in project", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      givenRequest.issueId
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.delete(givenRequest);

    await expect(when).rejects.toThrow(NotParticipantInProjectError);
  });

  it("should throw RoleInsufficientPermissionError if participant doesn't have role with sufficient permission", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      givenRequest.issueId
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const when = () => sut.delete(givenRequest);

    await expect(when).rejects.toThrow(RoleInsufficientPermissionError);
  });
});
