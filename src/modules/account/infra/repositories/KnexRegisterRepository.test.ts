import { RegisterRepositoryDTO } from "@modules/account/presentation/DTOs";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { connection, configuration } from "@shared/infra/database/connection";
import { mock } from "jest-mock-extended";
import { KnexRegisterRepository } from "./KnexRegisterRepository";

function makeSut() {
  const doesAccountExistRepositoryMock = mock<IDoesAccountExistRepository>();
  const languageMock = mock<IAccountLanguage>();
  languageMock.getInvalidEmailErrorMessage.mockReturnValue("Error");
  languageMock.getEmailAlreadyInUseErrorMessage.mockReturnValue("Error");
  const sut = new KnexRegisterRepository(
    doesAccountExistRepositoryMock,
    languageMock,
    languageMock
  );

  return { sut, doesAccountExistRepositoryMock, languageMock };
}

describe("createAccount repository using Knex", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should insert an Account", async () => {
    expect.assertions(1);

    const { sut, doesAccountExistRepositoryMock } = makeSut();
    const accountDTO: RegisterRepositoryDTO = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    await sut.create(accountDTO);

    const account = await connection("account")
      .select("*")
      .where({ email: accountDTO.email })
      .first();
    expect(account).toMatchObject({
      name: accountDTO.name,
      email: accountDTO.email,
    });
  });

  it("should throw EmailAlreadyInUseError if account has been created before", async () => {
    expect.assertions(1);

    const { sut, doesAccountExistRepositoryMock, languageMock } = makeSut();
    const accountDTO: RegisterRepositoryDTO = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);

    const when = () => sut.create(accountDTO);

    await expect(when).rejects.toThrow(
      new EmailAlreadyInUseError(accountDTO.email, languageMock)
    );
  });

  it("should throw InvalidEmailError if email is invalid", async () => {
    expect.assertions(1);

    const { sut, doesAccountExistRepositoryMock, languageMock } = makeSut();
    const accountDTO: RegisterRepositoryDTO = {
      name: "Jorge",
      email: "1238yewqhi",
      password: "pa55",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    const when = () => sut.create(accountDTO);

    await expect(when).rejects.toThrow(
      new EmailAlreadyInUseError(accountDTO.email, languageMock)
    );
  });
});
