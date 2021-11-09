import { mock } from "jest-mock-extended";
import { AcceptInvitationToProjectUseCase } from "./AcceptInvitationToProjectUseCase";
import { InvalidInvitationTokenError } from "./errors/InvalidInvitationTokenError";
import { IInvalidInvitationTokenErrorLanguage } from "./interfaces/languages";
import {
  IAcceptInvitationTokenRepository,
  IIsInvitationTokenValidRepository,
} from "./interfaces/repositories";

function makeSut() {
  const acceptInvitationTokenRepositoryMock =
    mock<IAcceptInvitationTokenRepository>();
  const isInvitationTokenValidRepositoryMock =
    mock<IIsInvitationTokenValidRepository>();
  const invalidInvitationTokenErrorLanguageMock =
    mock<IInvalidInvitationTokenErrorLanguage>();
  const sut = new AcceptInvitationToProjectUseCase(
    acceptInvitationTokenRepositoryMock,
    isInvitationTokenValidRepositoryMock,
    invalidInvitationTokenErrorLanguageMock
  );

  return {
    sut,
    acceptInvitationTokenRepositoryMock,
    isInvitationTokenValidRepositoryMock,
  };
}

describe("acceptInvitationToProject use-case", () => {
  it("should call the repository", async () => {
    expect.assertions(1);

    const {
      sut,
      acceptInvitationTokenRepositoryMock,
      isInvitationTokenValidRepositoryMock,
    } = makeSut();
    const givenToken = "invitationToken-0";
    isInvitationTokenValidRepositoryMock.isInvitationTokenValid.mockResolvedValueOnce(
      true
    );
    await sut.accept(givenToken);

    expect(
      acceptInvitationTokenRepositoryMock.acceptInvitationToken
    ).toHaveBeenNthCalledWith(1, givenToken);
  });

  it("should throw InvalidInvitationTokenError", async () => {
    expect.assertions(1);

    const { sut, isInvitationTokenValidRepositoryMock } = makeSut();
    isInvitationTokenValidRepositoryMock.isInvitationTokenValid.mockResolvedValueOnce(
      false
    );

    const when = () => sut.accept("invitationToken-0");

    await expect(when).rejects.toThrow(InvalidInvitationTokenError);
  });
});
