import { configuration, connection } from "@shared/infra/database/connection";
import { KnexCreateProjectRepository } from "./KnexCreateProjectRepository";

function makeSut() {
  const sut = new KnexCreateProjectRepository();

  return { sut };
}

describe("createProject repository using Knex", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    await connection("account").insert({
      id: "account-id-0",
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

  it("should insert a Project with beings_at and finishes_at as null", async () => {
    expect.assertions(1);

    const { sut } = makeSut();
    const givenProject = {
      projectId: "project-0",
      name: "my project",
      description: "my project's description",
      ownerEmail: "jorge@email.com",
    };

    await sut.createProject(givenProject);

    const project = await connection("project")
      .select("*")
      .where({ id: givenProject.projectId })
      .first();
    expect(project).toMatchObject({
      name: "my project",
      description: "my project's description",
      begins_at: null,
      finishes_at: null,
    });
  });
});
