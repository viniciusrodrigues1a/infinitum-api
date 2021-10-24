import { configuration, connection } from "@shared/infra/database/connection";
import { KnexProjectRepository } from "./KnexProjectRepository";

function makeSut() {
  const sut = new KnexProjectRepository();

  return { sut };
}

describe("project repository using Knex", () => {
  let accountId: string;
  let accountEmail: string;
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    accountId = "account-id-0";
    accountEmail = "jorge@email.com";
    await connection("account").insert({
      id: accountId,
      email: accountEmail,
      name: "jorge",
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

  describe("listProjects", () => {
    it("should return an array of projects associated to an account", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      await connection("project").insert(project);

      const projects = await sut.listProjects(accountEmail);

      expect(projects[0].projectId).toBe(project.id);
    });

    it("should return an empty array if account has no projects", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const givenEmail = "newaccount@email.com";
      await connection("account").insert({
        id: "account-id-123421",
        email: givenEmail,
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });

      const projects = await sut.listProjects(givenEmail);

      expect(projects).toHaveLength(0);
    });

    it.todo("should return an array of projects joined with issues");
  });

  describe("updateProject method", () => {
    it("should update a project", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
      });

      const updatedProjectName = "updated project name";
      await sut.updateProject({ projectId, name: updatedProjectName });

      const project = await connection("project")
        .select("*")
        .where({ id: projectId })
        .first();
      expect(project.name).toBe(updatedProjectName);
    });

    it("should not update undefined fields", async () => {
      expect.assertions(2);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      const oldProjectDescription = "my project's description";
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: oldProjectDescription,
      });

      const updatedProjectName = "updated project name";
      await sut.updateProject({
        projectId,
        name: updatedProjectName,
        description: undefined,
      });

      const project = await connection("project")
        .select("*")
        .where({ id: projectId })
        .first();
      expect(project.name).toBe(updatedProjectName);
      expect(project.description).toBe(oldProjectDescription);
    });
  });

  describe("findParticipantRole method", () => {
    it("should return the string 'member'", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
      });
      const roleId = "role-id-0";
      await connection("project_role").insert({
        id: roleId,
        name: "member",
      });
      await connection("account_project_project_role").insert({
        account_id: accountId,
        project_id: projectId,
        project_role_id: roleId,
      });

      const role = await sut.findParticipantRole({ accountEmail, projectId });

      expect(role).toBe("member");
    });
  });

  describe("doesParticipantExist method", () => {
    it("should return true if participant exists", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
      });
      await connection("account_project_project_role").insert({
        account_id: accountId,
        project_id: projectId,
        project_role_id: "role-id-0",
      });

      const bool = await sut.doesParticipantExist({ accountEmail, projectId });

      expect(bool).toBe(true);
    });

    it("should return false if participant doesn't exist", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const bool = await sut.doesParticipantExist({
        accountEmail,
        projectId: "inexistent-project-id-1312456",
      });

      expect(bool).toBe(false);
    });
  });

  describe("doesProjectExist method", () => {
    it("should return true if project exists", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
      });

      const bool = await sut.doesProjectExist(projectId);

      expect(bool).toBe(true);
    });

    it("should return false if project doesn't exist", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const bool = await sut.doesProjectExist("inexistent-project-id-876182");

      expect(bool).toBe(false);
    });
  });

  describe("deleteProject method", () => {
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