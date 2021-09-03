import { IInvalidPasswordErrorLanguage } from "@modules/account/presentation/languages/IInvalidPasswordErrorLanguage";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { mock } from "jest-mock-extended";
import { jwtToken } from "../authentication";
import { pbkdf2 } from "../cryptography/Pbkdf2";
import { InvalidPasswordError } from "./errors";
import { KnexLoginRepository } from "./KnexLoginRepository";

function makeSut() {
  const findOneAccountRepositoryMock = mock<IFindOneAccountRepository>();
  const accountNotFoundErrorLanguageMock =
    mock<IAccountNotFoundErrorLanguage>();
  const invalidPasswordErrorLanguage = mock<IInvalidPasswordErrorLanguage>();
  const sut = new KnexLoginRepository(
    findOneAccountRepositoryMock,
    accountNotFoundErrorLanguageMock,
    invalidPasswordErrorLanguage
  );

  return { sut, findOneAccountRepositoryMock };
}

describe("login repository using Knex and JWT", () => {
  beforeAll(() => {
    jwtToken._config.signOptions.algorithm = undefined;
    jwtToken._config.privateKey = "secret-key";
    jwtToken._config.publicKey = "secret-key";
  });

  it("should return token", async () => {
    expect.assertions(1);

    const { sut, findOneAccountRepositoryMock } = makeSut();
    const credentials = { email: "jorge@email.com", password: "pa55word" };
    const accountId = "account-id-0";
    findOneAccountRepositoryMock.findOneAccount.mockResolvedValueOnce({
      id: accountId,
      password_hash: "hash",
      salt: "salt",
      iterations: 10,
    } as any);

    jest.spyOn(pbkdf2, "compare").mockReturnValueOnce(true);

    const token = await sut.login(credentials);

    const decoded = await jwtToken.verify(token);
    expect(decoded.id).toBe(accountId);
  });

  it("should throw InvalidPasswordError if password doesn't match", async () => {
    expect.assertions(1);

    const { sut, findOneAccountRepositoryMock } = makeSut();
    const credentials = { email: "jorge@email.com", password: "wrongpa55" };
    findOneAccountRepositoryMock.findOneAccount.mockResolvedValueOnce({
      id: "account-id-0",
      password_hash: "hash",
      salt: "salt",
      iterations: 10,
    } as any);

    jest.spyOn(pbkdf2, "compare").mockReturnValueOnce(false);

    const when = () => sut.login(credentials);

    await expect(when).rejects.toThrow(InvalidPasswordError);
  });

  it("should throw AccountNotFoundError if there's no account with provided email", async () => {
    expect.assertions(1);

    const { sut, findOneAccountRepositoryMock } = makeSut();
    const credentials = {
      email: "noaccountunder@email.com",
      password: "pa55word",
    };
    findOneAccountRepositoryMock.findOneAccount.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.login(credentials);

    await expect(when).rejects.toThrow(AccountNotFoundError);
  });
});
