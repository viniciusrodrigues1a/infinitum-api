import { AcceptInvitationToProjectUseCase } from "@modules/project/use-cases/AcceptInvitationToProjectUseCase";
import { InvalidInvitationTokenError } from "@modules/project/use-cases/errors/InvalidInvitationTokenError";
import { IInvalidInvitationTokenErrorLanguage } from "@modules/project/use-cases/interfaces/languages";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { AcceptInvitationToProjectController } from "./AcceptInvitationToProjectController";

const invalidInvitationTokenErrorLanguageMock =
  mock<IInvalidInvitationTokenErrorLanguage>();

function makeSut() {
  const acceptInvitationToProjectUseCaseMock =
    mock<AcceptInvitationToProjectUseCase>();
  const sut = new AcceptInvitationToProjectController(
    acceptInvitationToProjectUseCaseMock
  );

  return { sut, acceptInvitationToProjectUseCaseMock };
}

describe("acceptInvitationToProject controller", () => {
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(2);

    const { sut, acceptInvitationToProjectUseCaseMock } = makeSut();
    const givenToken = "invitationToken-0";

    const response = await sut.handleRequest({ invitationToken: givenToken });

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(acceptInvitationToProjectUseCaseMock.accept).toHaveBeenNthCalledWith(
      1,
      givenToken
    );
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, acceptInvitationToProjectUseCaseMock } = makeSut();
    acceptInvitationToProjectUseCaseMock.accept.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest({
      invitationToken: "invitationToken-0",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });

  it("should return HttpStatusCodes.badRequest if InvalidInvitationTokenError is thrown", async () => {
    expect.assertions(2);

    const { sut, acceptInvitationToProjectUseCaseMock } = makeSut();
    const errorThrown = new InvalidInvitationTokenError(
      invalidInvitationTokenErrorLanguageMock
    );
    acceptInvitationToProjectUseCaseMock.accept.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest({
      invitationToken: "invitationToken-0",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errorThrown);
  });
});
