import {
  IssueGroupNotFoundError,
  IssueNotFoundError,
} from "@modules/issue/use-cases/errors";
import {
  IIssueGroupBelongsToDifferentProjectErrorLanguage,
  IIssueGroupNotFoundErrorLanguage,
  IIssueNotFoundErrorLanguage,
} from "@modules/issue/use-cases/interfaces/languages";
import {
  IDoesIssueExistRepository,
  IDoesIssueGroupExistRepository,
  IMoveIssueToAnotherIssueGroupRepository,
  IShouldIssueGroupUpdateIssuesToCompletedRepository,
  IUpdateIssueRepository,
} from "@modules/issue/use-cases/interfaces/repositories";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import {
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueGroupIdRepository,
  IFindProjectIdByIssueIdRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import { IRoleInsufficientPermissionErrorLanguage } from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import * as RoleModule from "@modules/project/entities/value-objects/Role";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors";
import { IssueGroupBelongsToDifferentProjectError } from "./errors";
import { MoveIssueToAnotherIssueGroupUseCase } from "./MoveIssueToAnotherIssueGroupUseCase";

jest.mock("@modules/project/entities/Project");

function makeSut() {
  const moveIssueToAnotherIssueGroupRepositoryMock =
    mock<IMoveIssueToAnotherIssueGroupRepository>();
  const doesIssueExistRepositoryMock = mock<IDoesIssueExistRepository>();
  const doesIssueGroupExistRepositoryMock =
    mock<IDoesIssueGroupExistRepository>();
  const findProjectIdByIssueGroupIdRepositoryMock =
    mock<IFindProjectIdByIssueGroupIdRepository>();
  const findProjectIdByIssueIdRepositoryMock =
    mock<IFindProjectIdByIssueIdRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const shouldIssueGroupUpdateIssuesToCompletedRepositoryMock =
    mock<IShouldIssueGroupUpdateIssuesToCompletedRepository>();
  const updateIssueRepositoryMock = mock<IUpdateIssueRepository>();
  const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
  const issueGroupNotFoundErrorLanguageMock =
    mock<IIssueGroupNotFoundErrorLanguage>();
  const issueGroupBelongsToDifferentProjectErrorLanguageMock =
    mock<IIssueGroupBelongsToDifferentProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new MoveIssueToAnotherIssueGroupUseCase(
    moveIssueToAnotherIssueGroupRepositoryMock,
    doesIssueExistRepositoryMock,
    doesIssueGroupExistRepositoryMock,
    findProjectIdByIssueGroupIdRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    shouldIssueGroupUpdateIssuesToCompletedRepositoryMock,
    updateIssueRepositoryMock,
    issueNotFoundErrorLanguageMock,
    issueGroupNotFoundErrorLanguageMock,
    issueGroupBelongsToDifferentProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    moveIssueToAnotherIssueGroupRepositoryMock,
    doesIssueExistRepositoryMock,
    doesIssueGroupExistRepositoryMock,
    findProjectIdByIssueGroupIdRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    shouldIssueGroupUpdateIssuesToCompletedRepositoryMock,
    updateIssueRepositoryMock,
  };
}

describe("moveIssueToAnotherIssueGroup use-case", () => {
  let roleSpy: any;
  beforeEach(() => {
    roleSpy = jest.spyOn(RoleModule, "Role");
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
      moveIssueToAnotherIssueGroupRepositoryMock,
      doesIssueExistRepositoryMock,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.moveIssue(givenRequest);

    expect(
      moveIssueToAnotherIssueGroupRepositoryMock.moveIssue
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw IssueNotFoundError", async () => {
    expect.assertions(1);

    const { sut, doesIssueExistRepositoryMock } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(false);

    const when = () => sut.moveIssue(givenRequest);

    await expect(when).rejects.toThrow(IssueNotFoundError);
  });

  it("should throw IssueGroupNotFoundError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      doesIssueGroupExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.moveIssue(givenRequest);

    await expect(when).rejects.toThrow(IssueGroupNotFoundError);
  });

  it("should throw IssueGroupBelongsToDifferentProjectError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "different-project-id-999"
    );

    const when = () => sut.moveIssue(givenRequest);

    await expect(when).rejects.toThrow(
      IssueGroupBelongsToDifferentProjectError
    );
  });

  it("should throw RoleInsufficientPermissionError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const when = () => sut.moveIssue(givenRequest);

    await expect(when).rejects.toThrow(RoleInsufficientPermissionError);
  });

  it("should call the repository to update an issue to completed: true if issue group is the final one", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
      shouldIssueGroupUpdateIssuesToCompletedRepositoryMock,
      updateIssueRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    shouldIssueGroupUpdateIssuesToCompletedRepositoryMock.shouldIssueGroupUpdateIssues.mockResolvedValueOnce(
      true
    );

    await sut.moveIssue(givenRequest);

    const updateDTO = {
      issueId: givenRequest.issueId,
      newCompleted: true,
    };
    expect(updateIssueRepositoryMock.updateIssue).toHaveBeenNthCalledWith(
      1,
      updateDTO
    );
  });

  it("should call the repository to update an issue to completed: false if issue group is the final one", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueExistRepositoryMock,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
      shouldIssueGroupUpdateIssuesToCompletedRepositoryMock,
      updateIssueRepositoryMock,
    } = makeSut();
    const givenRequest = {
      issueId: "issue-id-0",
      moveToIssueGroupId: "ig-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    shouldIssueGroupUpdateIssuesToCompletedRepositoryMock.shouldIssueGroupUpdateIssues.mockResolvedValueOnce(
      false
    );

    await sut.moveIssue(givenRequest);

    const updateDTO = {
      issueId: givenRequest.issueId,
      newCompleted: false,
    };
    expect(updateIssueRepositoryMock.updateIssue).toHaveBeenNthCalledWith(
      1,
      updateDTO
    );
  });
});
