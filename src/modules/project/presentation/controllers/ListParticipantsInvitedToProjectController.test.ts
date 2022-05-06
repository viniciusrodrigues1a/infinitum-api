import { ListParticipantsInvitedToProjectUseCase } from "@modules/project/use-cases";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import {
  IProjectNotFoundErrorLanguage,
  INotParticipantInProjectErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import { mock } from "jest-mock-extended";
import {
  ListParticipantsInvitedToProjectController,
  ListParticipantsInvitedToProjectControllerRequest,
} from "./ListParticipantsInvitedToProjectController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

function makeSut() {
  const listParticipantsInvitedToProjectUseCaseMock =
    mock<ListParticipantsInvitedToProjectUseCase>();
  const sut = new ListParticipantsInvitedToProjectController(
    listParticipantsInvitedToProjectUseCaseMock
  );

  return { sut, listParticipantsInvitedToProjectUseCaseMock };
}

describe("listParticipantsInvitedToProject controller", () => {
  it("should return HttpStatusCodes.ok and a list of participants returned from the use-case", async () => {
    expect.assertions(2);

    const { sut, listParticipantsInvitedToProjectUseCaseMock } = makeSut();
    const mockedUseCaseResponse = [{ name: "amy", email: "amy@email.com" }];
    listParticipantsInvitedToProjectUseCaseMock.listParticipants.mockResolvedValueOnce(
      mockedUseCaseResponse
    );
    const givenRequest: ListParticipantsInvitedToProjectControllerRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(response.body).toBe(mockedUseCaseResponse);
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(1);

    const { sut, listParticipantsInvitedToProjectUseCaseMock } = makeSut();
    listParticipantsInvitedToProjectUseCaseMock.listParticipants.mockImplementationOnce(
      () => {
        throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
      }
    );
    const givenRequest: ListParticipantsInvitedToProjectControllerRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(1);

    const { sut, listParticipantsInvitedToProjectUseCaseMock } = makeSut();
    const givenRequest: ListParticipantsInvitedToProjectControllerRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };
    listParticipantsInvitedToProjectUseCaseMock.listParticipants.mockImplementationOnce(
      () => {
        throw new NotParticipantInProjectError(
          givenRequest.accountEmailMakingRequest,
          notParticipantInProjectErrorLanguageMock
        );
      }
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(1);

    const { sut, listParticipantsInvitedToProjectUseCaseMock } = makeSut();
    listParticipantsInvitedToProjectUseCaseMock.listParticipants.mockImplementationOnce(
      () => {
        throw new RoleInsufficientPermissionError(
          "user-role",
          roleInsufficientPermissionErrorLanguageMock
        );
      }
    );
    const givenRequest: ListParticipantsInvitedToProjectControllerRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, listParticipantsInvitedToProjectUseCaseMock } = makeSut();
    listParticipantsInvitedToProjectUseCaseMock.listParticipants.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );
    const givenRequest: ListParticipantsInvitedToProjectControllerRequest = {
      projectId: "project-id-0",
      accountEmailMakingRequest: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
