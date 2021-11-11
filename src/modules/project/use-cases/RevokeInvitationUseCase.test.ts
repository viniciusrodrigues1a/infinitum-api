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
import * as RoleModule from "@modules/project/entities/value-objects/Role";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IRevokeInvitationRepository,
} from "./interfaces/repositories";
import { RevokeInvitationUseCase } from "./RevokeInvitationUseCase";

jest.mock("@modules/project/entities/Project");

function makeSut() {
  const revokeInvitationRepositoryMock = mock<IRevokeInvitationRepository>();
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
  const sut = new RevokeInvitationUseCase(
    revokeInvitationRepositoryMock,
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
    revokeInvitationRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock,
  };
}

describe("revokeInvitation use-case", () => {
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
      revokeInvitationRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return true;
        return false;
      }
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return "roleWithPermission";
        return "roleWithoutPermission";
      }
    );

    await sut.revokeInvitation(givenRequest);

    expect(
      revokeInvitationRepositoryMock.revokeInvitation
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw ProjectNotFoundError", async () => {
    expect.assertions(1);

    const { sut, doesProjectExistRepositoryMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.revokeInvitation(givenRequest);

    await expect(when).rejects.toThrow(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return false;
        return true;
      }
    );

    const when = () => sut.revokeInvitation(givenRequest);

    await expect(when).rejects.toThrow(NotParticipantInProjectError);
  });

  it("should throw RoleInsufficientPermissionError", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return "roleWithoutPermission";
        return "roleWithPermission";
      }
    );

    const when = () => sut.revokeInvitation(givenRequest);

    await expect(when).rejects.toThrow(RoleInsufficientPermissionError);
  });
});
