import {
  IDoesParticipantExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectIdByIssueIdRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import * as RoleModule from "@modules/project/entities/value-objects";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { IssueNotFoundError } from "./errors";
import { IIssueNotFoundErrorLanguage } from "./interfaces/languages";
import {
  IFindOneIssueRepository,
  IUpdateIssueRepository,
} from "./interfaces/repositories";
import { UpdateIssueUseCase } from "./UpdateIssueUseCase";
import { Issue } from "../entities";

jest.mock("../../project/entities/value-objects/Role");
jest.mock("../entities/Issue");

function makeSut() {
  const updateIssueRepositoryMock = mock<IUpdateIssueRepository>();
  const findOneIssueRepositoryMock = mock<IFindOneIssueRepository>();
  const findProjectIdByIssueIdRepositoryMock =
    mock<IFindProjectIdByIssueIdRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
  const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new UpdateIssueUseCase(
    updateIssueRepositoryMock,
    findOneIssueRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    notFutureDateErrorLanguageMock,
    issueNotFoundErrorLanguageMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    updateIssueRepositoryMock,
    findOneIssueRepositoryMock,
    findProjectIdByIssueIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
  };
}

describe("updateIssue use-case", () => {
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
      updateIssueRepositoryMock,
      findOneIssueRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenNewIssue = {
      issueId: "issue-id-0",
      newTitle: "My issue's updated title",
      newDescription: "My issue's updated description",
      newExpiresAt: new Date(),
    };
    findOneIssueRepositoryMock.findOneIssue.mockResolvedValueOnce({
      title: "old title",
      description: "old description",
      ownerEmail: "jorge@email.com",
      assignedToEmail: "jorge",
      issueId: givenNewIssue.issueId,
      expiresAt: new Date(),
      createdAt: new Date(),
    });
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.update({
      accountEmailMakingRequest: "jorge@email.com",
      ...givenNewIssue,
    });

    expect(updateIssueRepositoryMock.updateIssue).toHaveBeenCalledTimes(1);
  });

  it("should instantiate Issue", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneIssueRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenNewIssue = {
      issueId: "issue-id-0",
      newTitle: "My issue's updated title",
      newDescription: "My issue's updated description",
      newExpiresAt: new Date(),
    };
    findOneIssueRepositoryMock.findOneIssue.mockResolvedValueOnce({
      title: "old title",
      description: "old description",
      ownerEmail: "jorge@email.com",
      assignedToEmail: "jorge",
      issueId: givenNewIssue.issueId,
      expiresAt: new Date(),
      createdAt: new Date(),
    });
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.update({
      accountEmailMakingRequest: "jorge@email.com",
      ...givenNewIssue,
    });

    expect(Issue).toHaveBeenCalledTimes(1);
  });

  it("should throw IssueNotFoundError if findOneIssueRepository returns undefined", async () => {
    expect.assertions(1);

    const { sut, findOneIssueRepositoryMock } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
      newTitle: "My issue's updated title",
      newDescription: "My issue's updated description",
      newExpiresAt: new Date(),
    };
    findOneIssueRepositoryMock.findOneIssue.mockResolvedValueOnce(undefined);

    const when = () => sut.update(givenRequest);

    await expect(when).rejects.toBeInstanceOf(IssueNotFoundError);
  });

  it("should throw ProjectNotFoundError if findProjectIdByIssueIdRepository returns undefined", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneIssueRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
      newTitle: "My issue's updated title",
      newDescription: "My issue's updated description",
      newExpiresAt: new Date(),
    };
    findOneIssueRepositoryMock.findOneIssue.mockResolvedValueOnce({
      title: "old title",
      description: "old description",
      ownerEmail: givenRequest.accountEmailMakingRequest,
      assignedToEmail: "jorge",
      issueId: givenRequest.issueId,
      expiresAt: new Date(),
      createdAt: new Date(),
    });
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.update(givenRequest);

    await expect(when).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if doesParticipantExistRepository returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneIssueRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
      newTitle: "My issue's updated title",
      newDescription: "My issue's updated description",
      newExpiresAt: new Date(),
    };
    findOneIssueRepositoryMock.findOneIssue.mockResolvedValueOnce({
      title: "old title",
      description: "old description",
      ownerEmail: givenRequest.accountEmailMakingRequest,
      assignedToEmail: "jorge",
      issueId: givenRequest.issueId,
      expiresAt: new Date(),
      createdAt: new Date(),
    });
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.update(givenRequest);

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should throw RoleInsufficientPermissionError", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneIssueRepositoryMock,
      findProjectIdByIssueIdRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      issueId: "issue-id-0",
      newTitle: "My issue's updated title",
      newDescription: "My issue's updated description",
      newExpiresAt: new Date(),
    };
    findOneIssueRepositoryMock.findOneIssue.mockResolvedValueOnce({
      title: "old title",
      description: "old description",
      ownerEmail: givenRequest.accountEmailMakingRequest,
      assignedToEmail: "jorge",
      issueId: givenRequest.issueId,
      expiresAt: new Date(),
      createdAt: new Date(),
    });
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const when = () => sut.update(givenRequest);

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });
});
