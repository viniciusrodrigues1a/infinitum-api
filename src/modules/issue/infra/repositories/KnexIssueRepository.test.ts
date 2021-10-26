import { configuration, connection } from "@shared/infra/database/connection";
import { KnexIssueRepository } from "./KnexIssueRepository";

function makeSut() {
  const sut = new KnexIssueRepository();

  return { sut };
}

describe("issue repository using Knex", () => {
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

  describe("doesIssueExist method", () => {
    it("should return true if issue exists", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
      };
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      const issue = {
        id: "issue-id-0",
        owner_id: accountId,
        issue_group_id: issueGroup.id,
        title: "My issue",
        description: "My issue's description",
      };
      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);
      await connection("issue").insert(issue);

      const response = await sut.doesIssueExist(issue.id);

      expect(response).toBe(true);
    });

    it("should return false if issue doesn't exist", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const response = await sut.doesIssueExist("issue-id-0");

      expect(response).toBe(false);
    });
  });

  describe("createIssue method", () => {
    it("should insert an issue associated to a user and a project", async () => {
      expect.assertions(3);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      await connection("project").insert(project);
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      await connection("issue_group").insert(issueGroup);
      const givenIssue = {
        title: "My issue",
        description: "My issue's description",
        ownerEmail: accountEmail,
        issueId: "issue-id-0",
        issueGroupId: issueGroup.id,
        createdAt: new Date(),
      };

      await sut.createIssue(givenIssue);

      const insertedIssue = await connection("issue")
        .select("*")
        .where({ id: givenIssue.issueId })
        .first();

      expect(insertedIssue.issue_group_id).toBe(issueGroup.id);
      expect(insertedIssue.owner_id).toBe(accountId);
      expect(insertedIssue.id).toBe(givenIssue.issueId);
    });
  });
});
