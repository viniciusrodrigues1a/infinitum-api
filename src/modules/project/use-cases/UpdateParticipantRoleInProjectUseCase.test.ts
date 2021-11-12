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
  IUpdateParticipantRoleInProjectRepository,
} from "./interfaces/repositories";
import { UpdateParticipantRoleInProjectUseCase } from "./UpdateParticipantRoleInProjectUseCase";
import {
  CannotUpdateRoleOfOwnerError,
  CannotUpdateRoleToOwnerError,
  CannotUpdateYourOwnRoleError,
} from "./errors";
import {
  ICannotUpdateRoleOfOwnerErrorLanguage,
  ICannotUpdateRoleToOwnerErrorLanguage,
  ICannotUpdateYourOwnRoleErrorLanguage,
} from "./interfaces/languages";

jest.mock("@modules/project/entities/Project");

function makeSut() {
  const updateParticipantRoleInProjectRepositoryMock =
    mock<IUpdateParticipantRoleInProjectRepository>();
  const doesProjectExistRepositoryMock = mock<IDoesProjectExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const cannotUpdateRoleToOwnerErrorLanguageMock =
    mock<ICannotUpdateRoleToOwnerErrorLanguage>();
  const cannotUpdateYourOwnRoleErrorLanguageMock =
    mock<ICannotUpdateYourOwnRoleErrorLanguage>();
  const cannotUpdateRoleOfOwnerErrorLanguageMock =
    mock<ICannotUpdateRoleOfOwnerErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new UpdateParticipantRoleInProjectUseCase(
    updateParticipantRoleInProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    projectNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    cannotUpdateRoleToOwnerErrorLanguageMock,
    cannotUpdateYourOwnRoleErrorLanguageMock,
    cannotUpdateRoleOfOwnerErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    updateParticipantRoleInProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
  };
}

describe("updateParticipantRoleInProject use-case", () => {
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
      updateParticipantRoleInProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "espectator",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.updateParticipantRole(givenRequest);

    expect(
      updateParticipantRoleInProjectRepositoryMock.updateParticipantRole
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw ProjectNotFoundError", async () => {
    expect.assertions(1);

    const { sut, doesProjectExistRepositoryMock } = makeSut();
    const givenRequest = {
      roleName: "espectator",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if accountEmailMakingRequest isn't a participant of given project id", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "espectator",
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

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(NotParticipantInProjectError);
  });

  it("should throw NotParticipantInProjectError if accountEmail isn't a participant of given project id", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "espectator",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmail) return false;
        return true;
      }
    );

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(NotParticipantInProjectError);
  });

  it("should instantiate Role", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "invalidrolename",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    await sut.updateParticipantRole(givenRequest);

    expect(roleSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw RoleInsufficientPermissionError if accountEmailMakingRequest doesn't have enough permission", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "espectator",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return "roleWithoutPermission";
        return "roleWithPermission";
      }
    );

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(RoleInsufficientPermissionError);
  });

  it("should throw CannotUpdateYourOwnRoleError if accountEmailMakingRequest and accountEmail are the same", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "espectator",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "jorge@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(CannotUpdateYourOwnRoleError);
  });

  it("should throw CannotUpdateRoleOfOwnerError if accountEmail is the owner of the project", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "espectator",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return "roleWithPermission";
        if (accountEmail === givenRequest.accountEmail) return "owner";
        return "roleWithoutPermission";
      }
    );

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(CannotUpdateRoleOfOwnerError);
  });

  it("should throw CannotUpdateRoleToOwnerError if roleName is owner", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      roleName: "owner",
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      accountEmailMakingRequest: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValue(
      "roleWithPermission"
    );

    const when = () => sut.updateParticipantRole(givenRequest);

    await expect(when).rejects.toThrow(CannotUpdateRoleToOwnerError);
  });
});
