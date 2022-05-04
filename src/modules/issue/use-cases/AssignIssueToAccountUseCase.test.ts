import { mock } from "jest-mock-extended";
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
import * as RoleModule from "@modules/project/entities/value-objects";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { IInvalidRoleNameErrorLanguage } from "@modules/project/entities/interfaces/languages";
import {
  IAssignIssueToAccountRepository,
  IDoesIssueExistRepository,
} from "./interfaces/repositories";
import { AssignIssueToAccountUseCase } from "./AssignIssueToAccountUseCase";
import { AssignIssueToAccountUseCaseDTO } from "./DTOs";
import { IssueNotFoundError } from "./errors";
import { IIssueNotFoundErrorLanguage } from "./interfaces/languages";

jest.mock("../../project/entities/value-objects/Role");

function makeSut() {
  const assignIssueToAccountMock = mock<IAssignIssueToAccountRepository>();
  const findProjectIdByIssueIdRepositoryMock =
    mock<IFindProjectIdByIssueIdRepository>();
  const doesIssueExistRepositoryMock = mock<IDoesIssueExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new AssignIssueToAccountUseCase(
    assignIssueToAccountMock,
    findProjectIdByIssueIdRepositoryMock,
    doesIssueExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    issueNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    assignIssueToAccountMock,
    findProjectIdByIssueIdRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    doesIssueExistRepositoryMock,
    notParticipantInProjectErrorLanguageMock,
  };
}

describe("assignIssueToAccount use-case", () => {
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

  it("should call the assignIssueToAccount repository", async () => {
    expect.assertions(1);

    const {
      sut,
      assignIssueToAccountMock,
      findProjectIdByIssueIdRepositoryMock,
      doesIssueExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest: AssignIssueToAccountUseCaseDTO = {
      accountEmailMakingRequest: "alan@email.com",
      assignedToEmail: "jorge@email.com",
      issueId: "issue-id-0",
    };
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.assign(givenRequest);

    expect(assignIssueToAccountMock.assignIssueToAccount).toHaveBeenCalledTimes(
      1
    );
  });

  it("should throw IssueNotFoundError if doesIssueExistRepository returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueIdRepositoryMock,
      doesIssueExistRepositoryMock,
    } = makeSut();
    const givenRequest: AssignIssueToAccountUseCaseDTO = {
      accountEmailMakingRequest: "alan@email.com",
      assignedToEmail: "jorge@email.com",
      issueId: "issue-id-0",
    };
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(false);

    const when = () => sut.assign(givenRequest);

    await expect(when).rejects.toBeInstanceOf(IssueNotFoundError);
  });

  it("should throw ProjectNotFoundError if findProjectIdByIssueIdRepository returns undefined", async () => {
    expect.assertions(1);

    const { sut, findProjectIdByIssueIdRepositoryMock } = makeSut();
    const givenRequest: AssignIssueToAccountUseCaseDTO = {
      accountEmailMakingRequest: "alan@email.com",
      assignedToEmail: "jorge@email.com",
      issueId: "issue-id-0",
    };
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.assign(givenRequest);

    await expect(when).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if accountEmailMakingRequest doesn't participate in the project", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueIdRepositoryMock,
      doesIssueExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      notParticipantInProjectErrorLanguageMock,
    } = makeSut();
    const givenRequest: AssignIssueToAccountUseCaseDTO = {
      accountEmailMakingRequest: "alan@email.com",
      assignedToEmail: "jorge@email.com",
      issueId: "issue-id-0",
    };
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return false;
        return true;
      }
    );
    notParticipantInProjectErrorLanguageMock.getNotParticipantInProjectErrorMessage.mockImplementation(
      (email) => email
    );

    const when = () => sut.assign(givenRequest);

    const expectedErr = new NotParticipantInProjectError(
      givenRequest.accountEmailMakingRequest,
      notParticipantInProjectErrorLanguageMock
    );
    await expect(when).rejects.toStrictEqual(expectedErr);
  });

  it("should throw NotParticipantInProjectError if assignedToEmail doesn't participate in the project", async () => {
    expect.assertions(1);

    const {
      sut,
      findProjectIdByIssueIdRepositoryMock,
      doesIssueExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      notParticipantInProjectErrorLanguageMock,
    } = makeSut();
    const givenRequest: AssignIssueToAccountUseCaseDTO = {
      accountEmailMakingRequest: "alan@email.com",
      assignedToEmail: "jorge@email.com",
      issueId: "issue-id-0",
    };
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.assignedToEmail) return false;
        return true;
      }
    );
    notParticipantInProjectErrorLanguageMock.getNotParticipantInProjectErrorMessage.mockImplementation(
      (email) => email
    );

    const when = () => sut.assign(givenRequest);

    const expectedErr = new NotParticipantInProjectError(
      givenRequest.assignedToEmail as string,
      notParticipantInProjectErrorLanguageMock
    );
    await expect(when).rejects.toStrictEqual(expectedErr);
  });

  it("should throw RoleInsufficientPermissionError if accountEmailMakingRequest doesn't have enough permissions", async () => {
    expect.assertions(2);

    const {
      sut,
      findProjectIdByIssueIdRepositoryMock,
      doesIssueExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest: AssignIssueToAccountUseCaseDTO = {
      accountEmailMakingRequest: "alan@email.com",
      assignedToEmail: "jorge@email.com",
      issueId: "issue-id-0",
    };
    findProjectIdByIssueIdRepositoryMock.findProjectIdByIssueId.mockResolvedValueOnce(
      "project-id-0"
    );
    doesIssueExistRepositoryMock.doesIssueExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const when = () => sut.assign(givenRequest);

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
    expect(
      findParticipantRoleInProjectRepositoryMock.findParticipantRole
    ).toHaveBeenCalledWith({
      projectId: "project-id-0",
      accountEmail: givenRequest.accountEmailMakingRequest,
    });
  });
});
