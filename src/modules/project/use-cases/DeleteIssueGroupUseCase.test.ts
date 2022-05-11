import {
  INotParticipantInProjectErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import * as RoleModule from "@modules/project/entities/value-objects/Role";
import { IDoesIssueGroupExistRepository } from "@modules/issue/use-cases/interfaces/repositories";
import { IssueGroupNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueGroupNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import {
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import {
  IDeleteIssueGroupRepository,
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueGroupIdRepository,
} from "./interfaces/repositories";
import { DeleteIssueGroupUseCase } from "./DeleteIssueGroupUseCase";
import { DeleteIssueGroupUseCaseDTO } from "./DTOs";

function makeSut() {
  const deleteIssueGroupRepositoryMock = mock<IDeleteIssueGroupRepository>();
  const doesIssueGroupExistRepositoryMock =
    mock<IDoesIssueGroupExistRepository>();
  const findProjectIdByIssueGroupIdRepositoryMock =
    mock<IFindProjectIdByIssueGroupIdRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const issueGroupNotFoundErrorLanguageMock =
    mock<IIssueGroupNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new DeleteIssueGroupUseCase(
    deleteIssueGroupRepositoryMock,
    doesIssueGroupExistRepositoryMock,
    findProjectIdByIssueGroupIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    issueGroupNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    deleteIssueGroupRepositoryMock,
    doesIssueGroupExistRepositoryMock,
    findProjectIdByIssueGroupIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
  };
}

describe("deleteIssueGroup use-case", () => {
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

  it("should call the deleteIssueGroupRepository", async () => {
    expect.assertions(1);

    const {
      sut,
      deleteIssueGroupRepositoryMock,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    const givenRequest: DeleteIssueGroupUseCaseDTO = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    await sut.deleteIssueGroup(givenRequest);

    expect(
      deleteIssueGroupRepositoryMock.deleteIssueGroup
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw IssueGroupNotFoundError if doesIssueGroupExistRepository returns false", async () => {
    expect.assertions(1);

    const { sut, doesIssueGroupExistRepositoryMock } = makeSut();
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      false
    );
    const givenRequest: DeleteIssueGroupUseCaseDTO = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const when = () => sut.deleteIssueGroup(givenRequest);

    await expect(when).rejects.toBeInstanceOf(IssueGroupNotFoundError);
  });

  it("should throw NotParticipantInProjectError if doesParticipantExistRepository returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueGroupExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );
    const givenRequest: DeleteIssueGroupUseCaseDTO = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const when = () => sut.deleteIssueGroup(givenRequest);

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should throw RoleInsufficientPermissionError if findParticipantRoleInProjectRepository returns a role that doesn't have enough permissions", async () => {
    expect.assertions(1);

    const {
      sut,
      doesIssueGroupExistRepositoryMock,
      findProjectIdByIssueGroupIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesIssueGroupExistRepositoryMock.doesIssueGroupExist.mockResolvedValueOnce(
      true
    );
    findProjectIdByIssueGroupIdRepositoryMock.findProjectIdByIssueGroupId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );
    const givenRequest: DeleteIssueGroupUseCaseDTO = {
      issueGroupId: "ig-id-0",
      accountEmailMakingRequest: "amy@email.com",
    };

    const when = () => sut.deleteIssueGroup(givenRequest);

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });
});
