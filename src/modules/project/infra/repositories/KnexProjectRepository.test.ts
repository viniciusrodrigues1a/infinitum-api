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

  describe("revokeInvitation method", () => {
    it("should remove a row in the project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      const projectInvitation = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: roleId,
        token: "invitationToken-0",
      };
      await connection("account").insert(newAccount);
      await connection("project").insert(project);
      await connection("project_invitation").insert(projectInvitation);

      await sut.revokeInvitation({
        projectId: project.id,
        accountEmail: newAccount.email,
      });

      const storedInvitation = await connection("project_invitation")
        .select("*")
        .where({ token: projectInvitation.token })
        .first();
      expect(storedInvitation).toBeUndefined();
    });
  });

  describe("kickParticipantFromProjectRepository method", () => {
    it("should remove a row in the account_project_project_role table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      await connection("project").insert(project);
      await connection("account_project_project_role").insert({
        account_id: accountId,
        project_id: project.id,
        project_role_id: roleId,
      });

      await sut.kickParticipant({
        projectId: project.id,
        accountEmail,
      });

      const participant = await connection("account_project_project_role")
        .select("*")
        .where({
          account_id: accountId,
          project_id: project.id,
        })
        .first();
      expect(participant).toBeUndefined();
    });
  });

  describe("acceptInvitationToken method", () => {
    it("should insert new row in the account_project_project_role table given invitation token", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      const projectInvitation = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: roleId,
        token: "invitationToken-0",
      };
      await connection("account").insert(newAccount);
      await connection("project").insert(project);
      await connection("project_invitation").insert(projectInvitation);

      await sut.acceptInvitationToken(projectInvitation.token);

      const expectedParticipant = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: roleId,
      };
      const insertedRow = await connection("account_project_project_role")
        .select("*")
        .where(expectedParticipant)
        .first();
      expect(insertedRow).toMatchObject(expectedParticipant);
    });
  });

  describe("isInvitationTokenValid method", () => {
    it("should return true if token is found in the project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      const projectInvitation = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: roleId,
        token: "invitationToken-0",
      };
      await connection("account").insert(newAccount);
      await connection("project").insert(project);
      await connection("project_invitation").insert(projectInvitation);

      const response = await sut.isInvitationTokenValid(
        projectInvitation.token
      );

      expect(response).toBe(true);
    });

    it("should return false if token CANNOT be found in the project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const response = await sut.isInvitationTokenValid(
        "inexistent-invitationToken-07132071320"
      );

      expect(response).toBe(false);
    });
  });

  describe("hasAccountBeenInvited method", () => {
    it("should return false if no row is found in project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      await connection("project").insert(project);

      const response = await sut.hasAccountBeenInvited({
        projectId: project.id,
        accountEmail,
      });

      expect(response).toBe(false);
    });

    it("should return true if a row is found in project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      const invitation = {
        project_id: project.id,
        project_role_id: roleId,
        account_id: accountId,
        token: "invitation-token-0",
      };
      await connection("project").insert(project);
      await connection("project_invitation").insert(invitation);

      const response = await sut.hasAccountBeenInvited({
        projectId: project.id,
        accountEmail,
      });

      expect(response).toBe(true);
    });
  });

  describe("createInvitationToken method", () => {
    it("should insert given object in project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      await connection("project").insert(project);
      const invitation = {
        projectId: project.id,
        roleName: "member",
        accountEmail,
        token: "invitation-token-0",
      };

      await sut.createInvitationToken(invitation);

      const insertedInvitation = await connection("project_invitation")
        .select("*")
        .where({ token: invitation.token })
        .first();
      expect(insertedInvitation).toMatchObject({
        project_id: invitation.projectId,
        token: invitation.token,
        account_id: accountId,
      });
    });
  });

  describe("findProjectIdByIssueId method", () => {
    it("should return project id associated to given issue id", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      const issue = {
        id: "issue-id-0",
        issue_group_id: issueGroup.id,
        owner_id: accountId,
        title: "My issue",
        description: "My issue's description",
      };
      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);
      await connection("issue").insert(issue);

      const projectId = await sut.findProjectIdByIssueId(issue.id);

      expect(projectId).toBe(project.id);
    });

    it("should return undefined if issue cannot be found", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const response = await sut.findProjectIdByIssueId("issue-id-124541125");

      expect(response).toBeUndefined();
    });
  });

  describe("findProjectIdByIssueGroupId method", () => {
    it("should return project id associated to given issue group id", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      await connection("project").insert(project);
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      await connection("issue_group").insert(issueGroup);

      const projectId = await sut.findProjectIdByIssueGroupId(issueGroup.id);

      expect(projectId).toBe(project.id);
    });

    it("should return undefined if issue group id cannot be found", async () => {
      expect.assertions(1);

      const { sut } = makeSut();

      const response = await sut.findProjectIdByIssueGroupId("ig-id-123312312");

      expect(response).toBeUndefined();
    });
  });

  describe("isProjectArchived method", () => {
    it("should return true if archived is true", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      await connection("project").insert(project);

      const response = await sut.isProjectArchived(project.id);

      expect(response).toBe(true);
    });

    it("should return false if archived is false", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        archived: false,
      };
      await connection("project").insert(project);

      const response = await sut.isProjectArchived(project.id);

      expect(response).toBe(false);
    });

    it("should return false if archived is null", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      await connection("project").insert(project);

      const response = await sut.isProjectArchived(project.id);

      expect(response).toBe(false);
    });
  });

  describe("hasProjectBegun method", () => {
    it("should return true if begins_at is in the past", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const now = new Date().getTime();
      const yesterday = new Date(now - 86400 * 1000);
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        begins_at: yesterday,
      };
      await connection("project").insert(project);

      const response = await sut.hasProjectBegun(project.id);

      expect(response).toBe(true);
    });

    it("should return true if begins_at is null", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      await connection("project").insert(project);

      const response = await sut.hasProjectBegun(project.id);

      expect(response).toBe(true);
    });

    it("should return false if begins_at is in the future", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const now = new Date().getTime();
      const tomorrow = new Date(now + 86400 * 1000);
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
        begins_at: tomorrow,
      };
      await connection("project").insert(project);

      const response = await sut.hasProjectBegun(project.id);

      expect(response).toBe(false);
    });
  });

  describe("createIssueGroup method", () => {
    it("should insert an issue group associated to given project", async () => {
      expect.assertions(2);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      await connection("project").insert(project);
      const givenIssueGroup = {
        issueGroupId: "ig-id-0",
        projectId: project.id,
        title: "In progress",
      };

      await sut.createIssueGroup(givenIssueGroup);

      const insertedIssueGroup = await connection("issue_group")
        .select("*")
        .where({ id: givenIssueGroup.issueGroupId })
        .first();

      expect(insertedIssueGroup.project_id).toBe(givenIssueGroup.projectId);
      expect(insertedIssueGroup.title).toBe(givenIssueGroup.title);
    });
  });

  describe("listProjects method", () => {
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

    it("should return an array of projects joined with issue_group and issue", async () => {
      expect.assertions(2);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      const issue = {
        id: "issue-id-0",
        issue_group_id: issueGroup.id,
        owner_id: accountId,
        title: "My issue",
        description: "My issue's description",
      };
      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);
      await connection("issue").insert(issue);

      const response = await sut.listProjects(accountEmail);

      expect(response[0].issueGroups[0].issueGroupId).toBe(issueGroup.id);
      expect(response[0].issueGroups[0].issues[0].issueId).toBe(issue.id);
    });

    it("should return an array of projects with an empty array for issues", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };

      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);

      const response = await sut.listProjects(accountEmail);

      expect(response[0].issueGroups[0].issues).toStrictEqual([]);
    });

    it("should return an array of projects with an empty array for issue groups", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        owner_id: accountId,
        name: "My project",
        description: "My project's description",
      };

      await connection("project").insert(project);

      const response = await sut.listProjects(accountEmail);

      expect(response[0].issueGroups).toStrictEqual([]);
    });

    it.todo("should return an array of projects joined with participants");
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

    it("should update project's field begins_at", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      const nowMs = new Date().getTime();
      const yesterday = new Date(nowMs - 86400 * 1000);
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
        begins_at: yesterday,
      });

      const updatedBeginsAt = new Date();
      await sut.updateProject({
        projectId,
        beginsAt: updatedBeginsAt,
      });

      const project = await connection("project")
        .select("*")
        .where({ id: projectId })
        .first();
      expect(project.begins_at).toBe(updatedBeginsAt.toString());
    });

    it("should update project's field finishes_at", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      const nowMs = new Date().getTime();
      const yesterday = new Date(nowMs - 86400 * 1000);
      await connection("project").insert({
        id: projectId,
        owner_id: accountId,
        name: "my project",
        description: "my project's description",
        finishes_at: yesterday,
      });

      const updatedFinishesAt = new Date();
      await sut.updateProject({
        projectId,
        finishesAt: updatedFinishesAt,
      });

      const project = await connection("project")
        .select("*")
        .where({ id: projectId })
        .first();
      expect(project.finishes_at).toBe(updatedFinishesAt.toString());
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
