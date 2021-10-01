import { configuration, connection } from "@shared/infra/database/connection";
import { KnexDeleteProjectRepository } from "./KnexDeleteProjectRepository";

function makeSut() {
  const sut = new KnexDeleteProjectRepository();

  return { sut };
}

describe("deleteProject repository", () => {
  let accountId: string;

  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    accountId = "account-id-0";
    await connection("account").insert({
      id: accountId,
      name: "jorge",
      email: "jorge@email.com",
      password_hash: "hash",
      salt: "salt",
      iterations: 1,
    });
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should delete a project", async () => {
    expect.assertions(1);

    const { sut } = makeSut();
    const projectId = "project-id-0";
    await connection("project").insert({
      id: projectId,
      owner_id: accountId,
      name: "my project",
      description: "my project's description",
    });

    await sut.deleteProject(projectId);

    const project = await connection("project")
      .select("*")
      .where({ id: projectId })
      .first();
    expect(project).toBeUndefined();
  });
});
