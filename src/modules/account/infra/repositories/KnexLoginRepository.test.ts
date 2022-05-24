import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { connection, configuration } from "@shared/infra/database/connection";
import { mock } from "jest-mock-extended";
import { jwtToken } from "../authentication";
import { pbkdf2 } from "../cryptography/Pbkdf2";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { KnexLoginRepository } from "./KnexLoginRepository";

function makeSut() {
  const findOneAccountRepositoryMock = mock<IFindOneAccountRepository>();
  const invalidCredentialsErrorLanguageMock =
    mock<IInvalidCredentialsErrorLanguage>();
  const sut = new KnexLoginRepository(
    findOneAccountRepositoryMock,
    invalidCredentialsErrorLanguageMock
  );

  return { sut, findOneAccountRepositoryMock };
}

describe("login repository using Knex and JWT", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  beforeAll(() => {
    jwtToken._config.signOptions.algorithm = "HS256";
    jwtToken._config.privateKey = "secret-key";
    jwtToken._config.publicKey = "secret-key";
  });

  it("should return token", async () => {
    expect.assertions(1);

    const { sut, findOneAccountRepositoryMock } = makeSut();
    const credentials = { email: "jorge@email.com", password: "pa55word" };
    findOneAccountRepositoryMock.findOneAccount.mockResolvedValueOnce({
      id: "account-id-0",
      name: "jorge",
      email: credentials.email,
      password_hash: "hash",
      salt: "salt",
      iterations: 10,
    } as any);

    jest.spyOn(pbkdf2, "compare").mockReturnValueOnce(true);

    const tokens = await sut.login(credentials);

    const decoded = await jwtToken.verify(tokens.accessToken);
    expect(decoded.email).toBe(credentials.email);
  });

  it("should throw InvalidCredentialsError if password doesn't match", async () => {
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

    await expect(when).rejects.toThrow(InvalidCredentialsError);
  });

  it("should throw InvalidCredentialsError if there's no account with provided email", async () => {
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

    await expect(when).rejects.toThrow(InvalidCredentialsError);
  });
});
