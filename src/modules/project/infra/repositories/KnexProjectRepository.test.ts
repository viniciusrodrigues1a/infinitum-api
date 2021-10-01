import { configuration, connection } from "@shared/infra/database/connection";
import { KnexProjectRepository } from "./KnexProjectRepository";

function makeSut() {
  const sut = new KnexProjectRepository();

  return { sut };
}

describe("project repository using Knex", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("deleteProject method", () => {
    let accountId: string;
    beforeEach(async () => {
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

  describe("createProject method", () => {
    let accountEmail: string;
    beforeEach(async () => {
      accountEmail = "jorge@email.com";
      await connection("account").insert({
        id: "account-id-0",
        name: "jorge",
        email: accountEmail,
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });
    });

    it("should insert a Project with beings_at and finishes_at as null", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const givenProject = {
        projectId: "project-0",
        name: "my project",
        description: "my project's description",
        ownerEmail: accountEmail,
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
});
