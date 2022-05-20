import { AssignIssueToAccountUseCase } from "@modules/issue/use-cases";
import { IssueNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import { IFindAccountLanguageIsoCodeRepository } from "@shared/infra/notifications/interfaces";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { IValidation } from "@shared/presentation/validation";
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
import { IFindAccountEmailAssignedToIssueRepository } from "../interfaces/repositories";
import {
  AssignIssueToAccountController,
  AssignIssueToAccountControllerRequest,
} from "./AssignIssueToAccountController";

const projectNotFoundErrorLanguageMock = mock<IProjectNotFoundErrorLanguage>();
const issueNotFoundErrorLanguageMock = mock<IIssueNotFoundErrorLanguage>();
const notParticipantInProjectErrorLanguageMock =
  mock<INotParticipantInProjectErrorLanguage>();
const roleInsufficientPermissionErrorLanguageMock =
  mock<IRoleInsufficientPermissionErrorLanguage>();

const languagesMock = { "en-us": {} };

function makeSut() {
  const assignIssueToAccountUseCaseMock = mock<AssignIssueToAccountUseCase>();
  const findAccountEmailAssignedToIssueRepositoryMock =
    mock<IFindAccountEmailAssignedToIssueRepository>();
  const validationMock = mock<IValidation>();
  const notificationServiceMock = mock<INotificationService>();
  const findAccountLanguageIsoCodeRepositoryMock =
    mock<IFindAccountLanguageIsoCodeRepository>();
  findAccountLanguageIsoCodeRepositoryMock.findIsoCode.mockResolvedValue(
    "en-us"
  );
  const sut = new AssignIssueToAccountController(
    assignIssueToAccountUseCaseMock,
    findAccountEmailAssignedToIssueRepositoryMock,
    validationMock,
    notificationServiceMock,
    findAccountLanguageIsoCodeRepositoryMock
  );

  return {
    sut,
    assignIssueToAccountUseCaseMock,
    validationMock,
    notificationServiceMock,
    findAccountLanguageIsoCodeRepositoryMock,
  };
}

describe("assignIssueToAccount controller", () => {
  it("should return HttpStatusCodes.noContent and call the use-case", async () => {
    expect.assertions(2);

    const { sut, assignIssueToAccountUseCaseMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(assignIssueToAccountUseCaseMock.assign).toHaveReturnedTimes(1);
  });

  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, assignIssueToAccountUseCaseMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    assignIssueToAccountUseCaseMock.assign.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });

  it("should return HttpStatusCodes.notFound if ProjectNotFoundError is thrown", async () => {
    expect.assertions(1);

    const { sut, assignIssueToAccountUseCaseMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    assignIssueToAccountUseCaseMock.assign.mockImplementationOnce(() => {
      throw new ProjectNotFoundError(projectNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.notFound if IssueNotFoundError is thrown", async () => {
    expect.assertions(1);

    const { sut, assignIssueToAccountUseCaseMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    assignIssueToAccountUseCaseMock.assign.mockImplementationOnce(() => {
      throw new IssueNotFoundError(issueNotFoundErrorLanguageMock);
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.badRequest if NotParticipantInProjectError is thrown", async () => {
    expect.assertions(1);

    const { sut, assignIssueToAccountUseCaseMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    assignIssueToAccountUseCaseMock.assign.mockImplementationOnce(() => {
      throw new NotParticipantInProjectError(
        givenRequest.assignedToEmail as string,
        notParticipantInProjectErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
  });

  it("should return HttpStatusCodes.unauthorized if RoleInsufficientPermissionError is thrown", async () => {
    expect.assertions(1);

    const { sut, assignIssueToAccountUseCaseMock } = makeSut();
    const givenRequest: AssignIssueToAccountControllerRequest = {
      issueId: "issue-id-0",
      assignedToEmail: "alan@email.com",
      accountEmailMakingRequest: "jorge@email.com",
      languages: languagesMock,
    };
    assignIssueToAccountUseCaseMock.assign.mockImplementationOnce(() => {
      throw new RoleInsufficientPermissionError(
        "user-role",
        roleInsufficientPermissionErrorLanguageMock
      );
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.unauthorized);
  });
});
