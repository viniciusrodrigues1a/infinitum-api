import crypto from "crypto";
import { configuration, connection } from "@shared/infra/database/connection";
import {
  UpdateAccountImageRepositoryDTO,
  UpdateAccountRepositoryDTO,
} from "@modules/account/presentation/DTOs";
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

  describe("findAccountLanguage method", () => {
    it("should return the language id of an account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const storedAccount = {
        id: "account-id-0",
        name: "Jorge",
        email: "jorge@email.com",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
        language_id: "language-id-0",
      };
      await connection("account").insert(storedAccount);

      const languageId = await sut.findAccountLanguage(storedAccount.email);

      expect(languageId).toBe(storedAccount.language_id);
    });
  });

  describe("findAccountImageDataURL method", () => {
    it("should return the dataURL of an account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const storedAccount = {
        id: "account-id-0",
        name: "Jorge",
        email: "jorge@email.com",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
        image:
          "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      };
      await connection("account").insert(storedAccount);

      const dataURL = await sut.findAccountImageDataURL(storedAccount.email);

      const expectedDataURL =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
      expect(dataURL).toBe(expectedDataURL);
    });

    it("should return the undefined", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const storedAccount = {
        id: "account-id-0",
        name: "Jorge",
        email: "jorge@email.com",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      await connection("account").insert(storedAccount);

      const dataURL = await sut.findAccountImageDataURL(storedAccount.email);

      expect(dataURL).toBeUndefined();
    });
  });

  describe("listLanguages method", () => {
    it("should list all rows in the table language", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const storedLanguage = {
        id: "lang-id-0",
        iso_code: "co-DE",
        display_name: "Some language",
      };
      await connection("language").insert(storedLanguage);

      const languages = await sut.listLanguages();

      expect(languages).toContainEqual({
        id: storedLanguage.id,
        isoCode: storedLanguage.iso_code,
        displayName: storedLanguage.display_name,
      });
    });
  });

  describe("updateAccountImage method", () => {
    it("should update column image in the account table with given file", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const storedAccount = {
        id: "account-id-0",
        name: "Jorge",
        email: "jorge@email.com",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      await connection("account").insert(storedAccount);
      const givenRequest: UpdateAccountImageRepositoryDTO = {
        email: storedAccount.email,
        fileBuffer: Buffer.from("image content"),
      };

      await sut.updateAccountImage(givenRequest);

      const updatedAccount = await connection("account")
        .select("*")
        .where({ id: storedAccount.id })
        .first();
      expect(updatedAccount.image).toStrictEqual(givenRequest.fileBuffer);
    });
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
        newLanguageId: "language-id-0",
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
          language_id: givenRequest.newLanguageId,
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
