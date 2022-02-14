import crypto from "crypto";
import { configuration, connection } from "@shared/infra/database/connection";
import { UpdateAccountRepositoryDTO } from "@modules/account/presentation/DTOs";
import { KnexAccountRepository } from "./KnexAccountRepository";
import { pbkdf2 } from "../cryptography";

function makeSut() {
  const sut = new KnexAccountRepository();

  return { sut };
}

describe("account repository using Knex", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("updateAccount method", () => {
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

  describe("findOneAccount method", () => {
    it("should return Account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const account = { name: "jorge", email: "jorge@email.com" };
      await connection("account").insert({
        ...account,
        id: crypto.randomUUID(),
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });

      const accountFound = await sut.findOneAccount(account.email);

      expect(accountFound!.email).toBe(account.email);
    });

    it("should return undefined if provided email isn't being used by any account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const accountEmail = "jorge@email.com";
      await connection("account").insert({
        name: "livia",
        email: "livia@email.com",
        id: crypto.randomUUID(),
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });

      const accountFound = await sut.findOneAccount(accountEmail);

      expect(accountFound).toBeUndefined();
    });

    it("should return undefined if no account has been registered", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const accountEmail = "jorge@email.com";

      const accountFound = await sut.findOneAccount(accountEmail);

      expect(accountFound).toBeUndefined();
    });
  });

  describe("doesAccountExist method", () => {
    it("should return true for existent account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const accountEmail = "jorge@email.com";
      await connection("account").insert({
        id: crypto.randomUUID(),
        name: "Jorge",
        email: accountEmail,
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });

      const doesItExist = await sut.doesAccountExist(accountEmail);

      expect(doesItExist).toBe(true);
    });

    it("should return false for inexistent account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const doesItExist = await sut.doesAccountExist("notexistent@email.com");

      expect(doesItExist).toBe(false);
    });
  });
});
