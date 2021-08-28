import { connection, configuration } from "@shared/infra/database/connection";
import { RegisterAccountRepositoryDTO } from "../DTOs/RegisterAccountRepositoryDTO";
import { KnexRegisterAccountRepository } from "./KnexRegisterAccountRepository";

function makeSut() {
  const sut = new KnexRegisterAccountRepository();

  return { sut };
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

    const { sut } = makeSut();
    const accountDTO: RegisterAccountRepositoryDTO = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };

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
});
