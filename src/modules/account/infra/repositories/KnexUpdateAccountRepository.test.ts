import { UpdateAccountRepositoryDTO } from "@modules/account/presentation/DTOs";
import { configuration, connection } from "@shared/infra/database/connection";
import { pbkdf2 } from "../cryptography";
import { KnexUpdateAccountRepository } from "./KnexUpdateAccountRepository";

function makeSut() {
  const sut = new KnexUpdateAccountRepository();

  return { sut };
}

describe("update account repository using Knex", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should update an Account", async () => {
    expect.assertions(2);

    const { sut } = makeSut();
    const givenRequest: UpdateAccountRepositoryDTO = {
      email: "jorge@email.com",
      newName: "julio",
      newEmail: "julio@email.com",
      newPassword: "newpa55",
    };
    const storedAccount = {
      id: "account-id-0",
      name: "Jorge",
      email: givenRequest.email,
      password_hash: "hash",
      salt: "salt",
      iterations: 1,
    };
    await connection("account").insert(storedAccount);
    const { hash, salt, iterations } = pbkdf2.hash(givenRequest.newPassword!);
    const pbkdf2Spy = jest.spyOn(pbkdf2, "hash");
    pbkdf2Spy.mockImplementation((_) => ({
      hash,
      salt,
      iterations,
    }));

    await sut.updateAccount(givenRequest);

    const updatedAccount = await connection("account")
      .select("*")
      .where({ id: storedAccount.id })
      .first();
    expect(updatedAccount).toStrictEqual(
      expect.objectContaining({
        name: givenRequest.newName,
        email: givenRequest.newEmail,
        password_hash: hash,
        salt,
        iterations,
      })
    );
    expect(pbkdf2.hash).toHaveBeenCalledTimes(1);
  });
});
