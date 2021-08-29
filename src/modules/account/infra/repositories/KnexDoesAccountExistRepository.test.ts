import crypto from "crypto";
import { connection, configuration } from "@shared/infra/database/connection";
import { KnexDoesAccountExistRepository } from "./KnexDoesAccountExistRepository";

function makeSut() {
  const sut = new KnexDoesAccountExistRepository();

  return { sut };
}

describe("doesAccountExist repository using Knex", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

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
