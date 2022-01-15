import { mock } from "jest-mock-extended";
import { AcceptInvitationToProjectUseCase } from "./AcceptInvitationToProjectUseCase";
import { InvalidInvitationTokenError } from "./errors/InvalidInvitationTokenError";
import { IInvalidInvitationTokenErrorLanguage } from "./interfaces/languages";
import {
  IAcceptInvitationTokenRepository,
  IFindOneAccountEmailByInvitationTokenRepository,
  IIsInvitationTokenValidRepository,
} from "./interfaces/repositories";

function makeSut() {
  const acceptInvitationTokenRepositoryMock =
    mock<IAcceptInvitationTokenRepository>();
  const isInvitationTokenValidRepositoryMock =
    mock<IIsInvitationTokenValidRepository>();
  const findOneAccountEmailByInvitationTokenRepositoryMock =
    mock<IFindOneAccountEmailByInvitationTokenRepository>();
  const invalidInvitationTokenErrorLanguageMock =
    mock<IInvalidInvitationTokenErrorLanguage>();
  const sut = new AcceptInvitationToProjectUseCase(
    acceptInvitationTokenRepositoryMock,
    isInvitationTokenValidRepositoryMock,
    findOneAccountEmailByInvitationTokenRepositoryMock,
    invalidInvitationTokenErrorLanguageMock
  );

  return {
    sut,
    acceptInvitationTokenRepositoryMock,
    isInvitationTokenValidRepositoryMock,
    findOneAccountEmailByInvitationTokenRepositoryMock,
  };
}

describe("acceptInvitationToProject use-case", () => {
  it("should call the repository", async () => {
    expect.assertions(1);

    const {
      sut,
      acceptInvitationTokenRepositoryMock,
      isInvitationTokenValidRepositoryMock,
      findOneAccountEmailByInvitationTokenRepositoryMock,
    } = makeSut();
    isInvitationTokenValidRepositoryMock.isInvitationTokenValid.mockResolvedValueOnce(
      true
    );
    findOneAccountEmailByInvitationTokenRepositoryMock.findOneAccountEmailByInvitationToken.mockResolvedValueOnce(
      "jorge@email.com"
    );
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      token: "invitationToken-0",
    };

    await sut.accept(givenRequest);

    expect(
      acceptInvitationTokenRepositoryMock.acceptInvitationToken
    ).toHaveBeenNthCalledWith(1, givenRequest.token);
  });

  it("should throw InvalidInvitationTokenError if token doesn't exist", async () => {
    expect.assertions(1);

    const {
      sut,
      isInvitationTokenValidRepositoryMock,
      findOneAccountEmailByInvitationTokenRepositoryMock,
    } = makeSut();
    isInvitationTokenValidRepositoryMock.isInvitationTokenValid.mockResolvedValueOnce(
      false
    );
    findOneAccountEmailByInvitationTokenRepositoryMock.findOneAccountEmailByInvitationToken.mockResolvedValueOnce(
      "jorge@email.com"
    );
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      token: "invitationToken-0",
    };

    const when = () => sut.accept(givenRequest);

    await expect(when).rejects.toThrow(InvalidInvitationTokenError);
  });

  it("should throw InvalidInvitationTokenError if accountEmailMakingRequest is different than account being invited by the invitation token", async () => {
    expect.assertions(1);

    const {
      sut,
      isInvitationTokenValidRepositoryMock,
      findOneAccountEmailByInvitationTokenRepositoryMock,
    } = makeSut();
    isInvitationTokenValidRepositoryMock.isInvitationTokenValid.mockResolvedValueOnce(
      true
    );
    findOneAccountEmailByInvitationTokenRepositoryMock.findOneAccountEmailByInvitationToken.mockResolvedValueOnce(
      "garcia@email.com"
    );
    const givenRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      token: "invitationToken-0",
    };

    const when = () => sut.accept(givenRequest);

    await expect(when).rejects.toThrow(InvalidInvitationTokenError);
  });
});
