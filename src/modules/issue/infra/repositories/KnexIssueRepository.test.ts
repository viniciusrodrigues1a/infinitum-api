import { configuration, connection } from "@shared/infra/database/connection";
import { KnexIssueRepository } from "./KnexIssueRepository";

function makeSut() {
  const sut = new KnexIssueRepository();

  return { sut };
}

describe("issue repository using Knex", () => {
  let accountId: string;
  let accountEmail: string;
  let issueGroupId: string;
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    accountId = "account-id-0";
    accountEmail = "jorge@email.com";
    issueGroupId = "ig-id-0";

    const account = {
      id: accountId,
      email: accountEmail,
      name: "jorge",
      password_hash: "hash",
      salt: "salt",
      iterations: 1,
    };
    const project = {
      id: "project-id-0",
      owner_id: accountId,
      name: "my project",
      description: "my project's description",
    };
    const issueGroup = {
      id: issueGroupId,
      project_id: project.id,
      title: "In progress",
    };

    await connection("account").insert(account);
    await connection("project").insert(project);
    await connection("issue_group").insert(issueGroup);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("updateIssue method", () => {
    it("should update an issue", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const issueId = "issue-id-0";
      await connection("issue").insert({
        id: "issue-id-0",
        title: "My issue",
        description: "My issue's description",
        owner_id: accountId,
        issue_group_id: issueGroupId,
      });
      const updatedIssueTitle = "updated issue name";

      await sut.updateIssue({ issueId, newTitle: updatedIssueTitle });

      const issue = await connection("issue")
        .select("*")
        .where({ id: issueId })
        .first();
      expect(issue.title).toBe(updatedIssueTitle);
    });
  });

  describe("deleteIssue method", () => {
    it("should delete an issue", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const issue = {
        id: "issue-id-0",
        issue_group_id: issueGroupId,
        owner_id: accountId,
        title: "My issue",
        description: "My issue's description",
      };
      await connection("issue").insert(issue);

      await sut.deleteIssue(issue.id);

      const insertedIssue = await connection("issue")
        .select("*")
        .where({ id: issue.id })
        .first();
      expect(insertedIssue).toBeUndefined();
    });
  });

  describe("doesIssueExist method", () => {
    it("should return true if issue exists", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const issue = {
        id: "issue-id-0",
        owner_id: accountId,
        issue_group_id: issueGroupId,
        title: "My issue",
        description: "My issue's description",
      };
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
      const givenIssue = {
        title: "My issue",
        description: "My issue's description",
        ownerEmail: accountEmail,
        issueId: "issue-id-0",
        issueGroupId,
        createdAt: new Date(),
      };

      await sut.createIssue(givenIssue);

      const insertedIssue = await connection("issue")
        .select("*")
        .where({ id: givenIssue.issueId })
        .first();

      expect(insertedIssue.issue_group_id).toBe(issueGroupId);
      expect(insertedIssue.owner_id).toBe(accountId);
      expect(insertedIssue.id).toBe(givenIssue.issueId);
    });
  });
});
