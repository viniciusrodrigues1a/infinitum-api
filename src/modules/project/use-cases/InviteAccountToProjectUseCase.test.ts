import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
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
import { Invitation } from "../entities";
import {
  IInvalidRoleNameErrorLanguage,
  IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
} from "../entities/interfaces/languages";
import * as RoleModule from "../entities/value-objects";
import {
  AccountAlreadyParticipatesInProjectError,
  AccountHasAlreadyBeenInvitedError,
} from "./errors";
import {
  IAccountAlreadyParticipatesInProjectErrorLanguage,
  IAccountHasAlreadyBeenInvitedErrorLanguage,
} from "./interfaces/languages";
import {
  ICreateInvitationTokenRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IFindProjectNameByProjectIdRepository,
  IHasAccountBeenInvitedToProjectRepository,
} from "./interfaces/repositories";
import { ISendInvitationToProjectEmailService } from "./interfaces/services";
import { InviteAccountToProjectUseCase } from "./InviteAccountToProjectUseCase";

jest.mock("../entities/value-objects/Role");
jest.mock("../entities/Invitation");

function makeSut() {
  const createInvitationTokenRepositoryMock =
    mock<ICreateInvitationTokenRepository>();
  const sendInvitationToProjectEmailServiceMock =
    mock<ISendInvitationToProjectEmailService>();
  const doesProjectExistRepositoryMock = mock<IDoesProjectExistRepository>();
  const doesAccountExistRepositoryMock = mock<IDoesAccountExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const hasAccountBeenInvitedToProjectRepositoryMock =
    mock<IHasAccountBeenInvitedToProjectRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const findProjectNameByProjectIdRepositoryMock =
    mock<IFindProjectNameByProjectIdRepository>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock =
    mock<IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const accountNotFoundErrorLanguageMock =
    mock<IAccountNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const accountHasAlreadyBeenInvitedErrorLanguageMock =
    mock<IAccountHasAlreadyBeenInvitedErrorLanguage>();
  const accountAlreadyParticipatesInProjectErrorLanguageMock =
    mock<IAccountAlreadyParticipatesInProjectErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();

  const sut = new InviteAccountToProjectUseCase(
    createInvitationTokenRepositoryMock,
    sendInvitationToProjectEmailServiceMock,
    doesProjectExistRepositoryMock,
    doesAccountExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    hasAccountBeenInvitedToProjectRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    findProjectNameByProjectIdRepositoryMock,
    invalidRoleNameErrorLanguageMock,
    ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock,
    projectNotFoundErrorLanguageMock,
    accountNotFoundErrorLanguageMock,
    notParticipantInProjectErrorLanguageMock,
    accountHasAlreadyBeenInvitedErrorLanguageMock,
    accountAlreadyParticipatesInProjectErrorLanguageMock,
    roleInsufficientPermissionErrorLanguageMock
  );

  return {
    sut,
    createInvitationTokenRepositoryMock,
    sendInvitationToProjectEmailServiceMock,
    doesProjectExistRepositoryMock,
    doesAccountExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    hasAccountBeenInvitedToProjectRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
    findProjectNameByProjectIdRepositoryMock,
  };
}

describe("inviteAccountToProject use-case", () => {
  let roleSpy: jest.SpyInstance<any, any>;
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

  it("should call createInvitationTokenRepository, sendInvitationToProjectEmailService and instantiate the entity Invitation", async () => {
    expect.assertions(3);

    const {
      sut,
      createInvitationTokenRepositoryMock,
      sendInvitationToProjectEmailServiceMock,
      doesProjectExistRepositoryMock,
      doesAccountExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasAccountBeenInvitedToProjectRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return true;
        if (accountEmail === givenRequest.accountEmail) return false;
        return false;
      }
    );
    hasAccountBeenInvitedToProjectRepositoryMock.hasAccountBeenInvited.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockImplementationOnce(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return "roleWithPermission";
        return "roleWithoutPermission";
      }
    );

    await sut.invite(givenRequest);

    expect(
      createInvitationTokenRepositoryMock.createInvitationToken
    ).toHaveBeenCalledTimes(1);
    expect(
      sendInvitationToProjectEmailServiceMock.sendInvitationEmail
    ).toHaveBeenCalledTimes(1);
    expect(Invitation).toHaveBeenCalledTimes(1);
  });

  it("should throw AccountNotFoundError if doesAccountExistRepository returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesAccountExistRepositoryMock,
    } = makeSut();
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      projectName: "my project",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };

    const when = () => sut.invite(givenRequest);

    await expect(when).rejects.toBeInstanceOf(AccountNotFoundError);
  });

  it("should throw ProjectNotFoundError if doesProjectExistRepository returns false", async () => {
    expect.assertions(1);

    const { sut, doesProjectExistRepositoryMock } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.invite(givenRequest);

    await expect(when).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if doesParticipantExistRepository returns false for accountEmailMakingRequest", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesAccountExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.invite(givenRequest);

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });

  it("should throw AccountAlreadyParticipatesInProjectError if doesParticipantExistRepository returns true for accountEmail", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesAccountExistRepositoryMock,
      doesParticipantExistRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return true;
        if (accountEmail === givenRequest.accountEmail) return true;
        return false;
      }
    );

    const when = () => sut.invite(givenRequest);

    await expect(when).rejects.toBeInstanceOf(
      AccountAlreadyParticipatesInProjectError
    );
  });

  it("should throw AccountHasAlreadyBeenInvitedError if hasAccountBeenInvitedToProjectRepository returns true", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesAccountExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasAccountBeenInvitedToProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return true;
        if (accountEmail === givenRequest.accountEmail) return false;
        return false;
      }
    );
    hasAccountBeenInvitedToProjectRepositoryMock.hasAccountBeenInvited.mockResolvedValueOnce(
      true
    );

    const when = () => sut.invite(givenRequest);

    await expect(when).rejects.toBeInstanceOf(
      AccountHasAlreadyBeenInvitedError
    );
  });

  it("should throw RoleInsufficientPermissionError if findParticipantRoleInProjectRepository returns a role that doesn't have sufficient permission", async () => {
    expect.assertions(1);

    const {
      sut,
      doesProjectExistRepositoryMock,
      doesAccountExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      hasAccountBeenInvitedToProjectRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      projectId: "project-id-0",
      accountEmail: "garcia@email.com",
      roleName: "member",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockImplementation(
      async ({ accountEmail }) => {
        if (accountEmail === givenRequest.accountEmailMakingRequest)
          return true;
        if (accountEmail === givenRequest.accountEmail) return false;
        return false;
      }
    );
    hasAccountBeenInvitedToProjectRepositoryMock.hasAccountBeenInvited.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );

    const when = () => sut.invite(givenRequest);

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });
});
