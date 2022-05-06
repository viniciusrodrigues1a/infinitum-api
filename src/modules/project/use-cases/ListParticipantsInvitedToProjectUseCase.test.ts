import { mock } from "jest-mock-extended";
import * as RoleModule from "@modules/project/entities/value-objects/Role";
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
import {
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IListParticipantsInvitedToProjectRepository,
} from "./interfaces/repositories";
import { IInvalidRoleNameErrorLanguage } from "../entities/interfaces/languages";
import { ListParticipantsInvitedToProjectUseCaseDTO } from "./DTOs";
import { ListParticipantsInvitedToProjectUseCase } from "./ListParticipantsInvitedToProjectUseCase";

jest.mock("../entities/value-objects/Role");

function makeSut() {
  const listParticipantsInvitedToProjectRepositoryMock =
    mock<IListParticipantsInvitedToProjectRepository>();
  const findParticipantRoleInProjectRepositoryMock =
    mock<IFindParticipantRoleInProjectRepository>();
  const doesProjectExistRepositoryMock = mock<IDoesProjectExistRepository>();
  const doesParticipantExistRepositoryMock =
    mock<IDoesParticipantExistRepository>();
  const projectNotFoundErrorLanguageMock =
    mock<IProjectNotFoundErrorLanguage>();
  const notParticipantInProjectErrorLanguageMock =
    mock<INotParticipantInProjectErrorLanguage>();
  const invalidRoleNameErrorLanguageMock =
    mock<IInvalidRoleNameErrorLanguage>();
  const roleInsufficientPermissionErrorLanguageMock =
    mock<IRoleInsufficientPermissionErrorLanguage>();
  const sut = new ListParticipantsInvitedToProjectUseCase(
    listParticipantsInvitedToProjectRepositoryMock,
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
    listParticipantsInvitedToProjectRepositoryMock,
    doesProjectExistRepositoryMock,
    doesParticipantExistRepositoryMock,
    findParticipantRoleInProjectRepositoryMock,
  };
}

describe("listParticipantsInvitedToProject use-case", () => {
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

  it("should be able to list all participants that have been invited to given project", async () => {
    expect.assertions(2);

    const {
      sut,
      listParticipantsInvitedToProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest: ListParticipantsInvitedToProjectUseCaseDTO = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "alan@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    const mockedParticipants = [{ name: "amy", email: "amy@email.com" }];
    listParticipantsInvitedToProjectRepositoryMock.listParticipants.mockResolvedValueOnce(
      mockedParticipants
    );

    const participants = await sut.listParticipants(givenRequest);

    expect(participants).toStrictEqual(mockedParticipants);
    expect(
      listParticipantsInvitedToProjectRepositoryMock.listParticipants
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw RoleInsufficientPermissionError if user doesn't have enough permission", async () => {
    expect.assertions(1);

    const {
      sut,
      listParticipantsInvitedToProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest: ListParticipantsInvitedToProjectUseCaseDTO = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "alan@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithoutPermission"
    );
    const mockedParticipants = [{ name: "amy", email: "amy@email.com" }];
    listParticipantsInvitedToProjectRepositoryMock.listParticipants.mockResolvedValueOnce(
      mockedParticipants
    );

    const when = () => sut.listParticipants(givenRequest);

    await expect(when).rejects.toBeInstanceOf(RoleInsufficientPermissionError);
  });

  it("should throw ProjectNotFoundError if doesProjectExistRepository returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      listParticipantsInvitedToProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest: ListParticipantsInvitedToProjectUseCaseDTO = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "alan@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(
      false
    );
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      true
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    const mockedParticipants = [{ name: "amy", email: "amy@email.com" }];
    listParticipantsInvitedToProjectRepositoryMock.listParticipants.mockResolvedValueOnce(
      mockedParticipants
    );

    const when = () => sut.listParticipants(givenRequest);

    await expect(when).rejects.toBeInstanceOf(ProjectNotFoundError);
  });

  it("should throw NotParticipantInProjectError if doesParticipantExistRepository returns false", async () => {
    expect.assertions(1);

    const {
      sut,
      listParticipantsInvitedToProjectRepositoryMock,
      doesProjectExistRepositoryMock,
      doesParticipantExistRepositoryMock,
      findParticipantRoleInProjectRepositoryMock,
    } = makeSut();
    const givenRequest: ListParticipantsInvitedToProjectUseCaseDTO = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "alan@email.com",
    };
    doesProjectExistRepositoryMock.doesProjectExist.mockResolvedValueOnce(true);
    doesParticipantExistRepositoryMock.doesParticipantExist.mockResolvedValueOnce(
      false
    );
    findParticipantRoleInProjectRepositoryMock.findParticipantRole.mockResolvedValueOnce(
      "roleWithPermission"
    );
    const mockedParticipants = [{ name: "amy", email: "amy@email.com" }];
    listParticipantsInvitedToProjectRepositoryMock.listParticipants.mockResolvedValueOnce(
      mockedParticipants
    );

    const when = () => sut.listParticipants(givenRequest);

    await expect(when).rejects.toBeInstanceOf(NotParticipantInProjectError);
  });
});
