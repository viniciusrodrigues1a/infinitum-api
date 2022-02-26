import { mock } from "jest-mock-extended";
import { AccountNotFoundError } from "./errors/AccountNotFoundError";
import { FindOneAccountUseCase } from "./FindOneAccountUseCase";
import { IAccountNotFoundErrorLanguage } from "./interfaces/languages";
import { IFindOneAccountRepository } from "./interfaces/repositories";

function makeSut() {
  const findOneAccountRepositoryMock = mock<IFindOneAccountRepository>();
  const accountNotFoundErrorLanguageMock =
    mock<IAccountNotFoundErrorLanguage>();
  accountNotFoundErrorLanguageMock.getAccountNotFoundErrorMessage.mockReturnValue(
    "mocked error msg"
  );
  const sut = new FindOneAccountUseCase(
    findOneAccountRepositoryMock,
    accountNotFoundErrorLanguageMock
  );

  return {
    sut,
    findOneAccountRepositoryMock,
    accountNotFoundErrorLanguageMock,
  };
}

describe("findOneAccount use-case", () => {
  it("should return an Account if it exists", async () => {
    expect.assertions(1);

    const { sut, findOneAccountRepositoryMock } = makeSut();
    const existentAccount = {
      name: "Jorge",
      email: "jorge@email.com",
    };
    findOneAccountRepositoryMock.findOneAccount.mockResolvedValueOnce(
      existentAccount
    );

    const account = await sut.findOne(existentAccount.email);

    expect(account.name).toBe(existentAccount.name);
  });

  it("should throw AccountNotFoundError if account doesn't exist", async () => {
    expect.assertions(1);

    const {
      sut,
      findOneAccountRepositoryMock,
      accountNotFoundErrorLanguageMock,
    } = makeSut();
    const accountEmail = "jorge@email.com";
    findOneAccountRepositoryMock.findOneAccount.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.findOne(accountEmail);

    await expect(when).rejects.toThrow(
      new AccountNotFoundError(accountEmail, accountNotFoundErrorLanguageMock)
    );
  });
});
