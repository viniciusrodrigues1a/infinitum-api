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
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
} from "./interfaces/repositories";
import { IKickParticipantFromProjectRepository } from "./interfaces/repositories/IKickParticipantFromProjectRepository";
import { ISendKickedOutOfProjectEmailService } from "./interfaces/services/ISendKickedOutOfProjectEmailService";
import { KickParticipantFromProjectUseCase } from "./KickParticipantFromProjectUseCase";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import {
  CannotKickOwnerOfProjectError,
  CannotKickYourselfError,
} from "./errors";
import {
  ICannotKickOwnerOfProjectErrorLanguage,
  ICannotKickYourselfErrorLanguage,
} from "./interfaces/languages";

function makeSut() {
  const kickParticipantFromProjectRepositoryMock =
    mock<IKickParticipantFromProjectRepository>();
  const doesProjectExistRepositoryMock = mock<IDoesProjectExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const sendKickedOutOfProjectEmailServiceMock =
    mock<ISendKickedOutOfProjectEmailService>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const cannotKickYourselfErrorLanguageMock =
    mock<ICannotKickYourselfErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const cannotKickOwnerOfProjectErrorLanguageMock =
    mock<ICannotKickOwnerOfProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();

  const sut = new KickParticipantFromProjectUseCase(
    kickParticipantFromProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    sendKickedOutOfProjectEmailServiceMock,
    projectNotFoundErrorLanguageMock,
    cannotKickYourselfErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    cannotKickOwnerOfProjectErrorLanguageMock,
    invalidRoleNameErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    kickParticipantFromProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    sendKickedOutOfProjectEmailServiceMock,
    notParticipantInProjectErrorLanguageMock,
  };
}

describe("kickParticipantFromProject use-case", () => {
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

  it("should call IKickParticipantFromProjectRepository and ISendKickedOutOfProjectEmailService implementations", async () => {
    expect.assertions(2);

    const {
      sut,
      kickParticipantFromProjectRepositoryMock,
      sendKickedOutOfProjectEmailServiceMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValue(
      "roleWithPermission"
    );

    await sut.kick({
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      accountEmail: "garcia@email.com",
    });

    expect(
      kickParticipantFromProjectRepositoryMock.kickParticipant
    ).toHaveBeenCalledTimes(1);
    expect(
      sendKickedOutOfProjectEmailServiceMock.sendKickedOutOfProjectEmail
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw ProjectNotFoundError", async () => {
    expect.assertions(1);

    const { sut, doesProjectExistRepositoryMock } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );

    const when = () =>
      sut.kick({
        projectId: "project-id-0",
        accountEmailMakingRequest: "jorge@email.com",
        accountEmail: "garcia@email.com",
      });

    await expect(when).rejects.toThrow(ProjectNotFoundError);
  });

  it("should throw CannotKickOwnerOfProjectError if account being kicked is the owner of the project", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      accountEmail: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmail) return "owner";
        return "roleWithPermission";
      }
    );

    const when = () => sut.kick(givenRequest);

    await expect(when).rejects.toThrow(CannotKickOwnerOfProjectError);
  });

  it("should throw NotParticipantInProjectError if accountEmailMakingRequest cannot be found in this project", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      accountEmail: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return false;
        return true;
      }
    );

    const when = () => sut.kick(givenRequest);

    await expect(when).rejects.toThrow(NotParticipantInProjectError);
  });

  it("should throw NotParticipantInProjectError if accountEmail cannot be found in this project", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      accountEmail: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmail) return false;
        return true;
      }
    );

    const when = () => sut.kick(givenRequest);

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
      accountEmailMakingRequest: "jorge@email.com",
      accountEmail: "garcia@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValue(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return "roleWithoutPermission";
        return "roleWithPermission";
      }
    );

    const when = () => sut.kick(givenRequest);

    await expect(when).rejects.toThrow(RoleInsufficientPermissionError);
  });

  it("should throw CannotKickYourselfError if trying to kick your own email", async () => {
    expect.assertions(1);

    const { sut, doesProjectExistRepositoryMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
      accountEmail: "jorge@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);

    const when = () => sut.kick(givenRequest);

    await expect(when).rejects.toThrow(CannotKickYourselfError);
  });
});
