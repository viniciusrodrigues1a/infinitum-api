import { Issue } from "@modules/issue/entities";
import { Project } from "@modules/project/entities";
import {
  IssueGroup,
  Participant,
  Role,
} from "@modules/project/entities/value-objects";
import { configuration, connection } from "@shared/infra/database/connection";
import { KnexProjectRepository } from "./KnexProjectRepository";

function makeSut() {
  const sut = new KnexProjectRepository();

  return { sut };
}

describe("project repository using Knex", () => {
  let accountId: string;
  let accountEmail: string;
  let accountName: string;
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    accountId = "account-id-0";
    accountEmail = "jorge@email.com";
    accountName = "jorge";
    await connection("account").insert({
      id: accountId,
      email: accountEmail,
      name: accountName,
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

  describe("deleteIssueGroup method", () => {
    it("should delete a row in the issue_group table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: false,
      };
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);

      await sut.deleteIssueGroup(issueGroup.id);

      const storedIssueGroup = await connection("issue_group")
        .select("*")
        .where({ id: issueGroup.id })
        .first();
      expect(storedIssueGroup).toBeUndefined();
    });
  });

  describe("listParticipants method", () => {
    it("should list every account associated to given project id in table project_invitation", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: false,
      };
      const accountBeingInvited = {
        id: "account-id-123",
        email: "garcia@email.com",
        name: "garcia",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      const projectInvitation = {
        account_id: accountBeingInvited.id,
        project_id: project.id,
        project_role_id: roleId,
        token: "invitationToken-0",
      };
      await connection("project").insert(project);
      await connection("account").insert(accountBeingInvited);
      await connection("project_invitation").insert(projectInvitation);

      const participants = await sut.listParticipants(project.id);

      expect(participants).toEqual([
        {
          name: accountBeingInvited.name,
          email: accountBeingInvited.email,
          image: null,
        },
      ]);
    });
  });

  describe("findAllEmailsOfOwnersAndAdmins method", () => {
    it("should return every email that has the owner or admin role in given project", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        begins_at: new Date().toISOString(),
      };
      const newAccount = {
        id: "account-id-123",
        email: "alan@email.com",
        name: "alan",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const newAccount1 = {
        ...newAccount,
        id: "account-id-124",
        email: "jorge@email.com",
        name: "jorge",
      };
      const { id: adminRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "admin" })
        .first();
      const { id: especRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "espectator" })
        .first();
      const ownerParticipant = {
        account_id: accountId,
        project_id: project.id,
        project_role_id: adminRoleId,
      };
      const adminParticipant = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: adminRoleId,
      };
      const especParticipant = {
        account_id: newAccount1.id,
        project_id: project.id,
        project_role_id: especRoleId,
      };
      await connection("account").insert(newAccount);
      await connection("account").insert(newAccount1);
      await connection("project").insert(project);
      await connection("account_project_project_role").insert(ownerParticipant);
      await connection("account_project_project_role").insert(adminParticipant);
      await connection("account_project_project_role").insert(especParticipant);

      const emails = await sut.findAllEmailsOfOwnersAndAdmins(project.id);

      expect(emails).toEqual([accountEmail, newAccount.email]);
    });
  });

  describe("findAllEmails method", () => {
    it("should return every email that participates in given project", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        begins_at: new Date().toISOString(),
      };
      const newAccount = {
        id: "account-id-123",
        email: "alan@email.com",
        name: "alan",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const newAccount1 = {
        ...newAccount,
        id: "account-id-124",
        email: "jorge@email.com",
        name: "jorge",
      };
      const { id: adminRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "admin" })
        .first();
      const adminParticipant = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: adminRoleId,
      };
      const adminParticipant1 = {
        ...adminParticipant,
        account_id: newAccount1.id,
      };
      await connection("account").insert(newAccount);
      await connection("account").insert(newAccount1);
      await connection("project").insert(project);
      await connection("account_project_project_role").insert(adminParticipant);
      await connection("account_project_project_role").insert(
        adminParticipant1
      );

      const emails = await sut.findAllEmails(project.id);

      expect(emails).toEqual([newAccount.email, newAccount1.email]);
    });
  });

  describe("findStartDate method", () => {
    it("should return the start date of a project", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        begins_at: new Date().toISOString(),
      };
      await connection("project").insert(project);

      const date = await sut.findStartDate(project.id);

      expect(date).toStrictEqual(new Date(project.begins_at));
    });

    it("should return null if project doesn't have a start date", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
      };
      await connection("project").insert(project);

      const date = await sut.findStartDate(project.id);

      expect(date).toBeNull();
    });
  });

  describe("updateIssueGroupColor method", () => {
    it("should update the color column of the issue group table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: false,
      };
      const issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "In progress",
      };
      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);
      const givenRequest = {
        issueGroupId: issueGroup.id,
        newColor: "FF0000",
      };

      await sut.updateIssueGroupColor(givenRequest);

      const updatedIssueGroup = await connection("issue_group")
        .select("color")
        .where({ id: issueGroup.id })
        .first();
      expect(updatedIssueGroup.color).toBe(givenRequest.newColor);
    });
  });

  describe("findOneAccountEmailByInvitationToken method", () => {
    it("should return the email of the account associated to given invitation token", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: false,
      };
      const accountBeingInvited = {
        id: "account-id-123",
        email: "garcia@email.com",
        name: "garcia",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      const projectInvitation = {
        account_id: accountBeingInvited.id,
        project_id: project.id,
        project_role_id: roleId,
        token: "invitationToken-0",
      };
      await connection("project").insert(project);
      await connection("account").insert(accountBeingInvited);
      await connection("project_invitation").insert(projectInvitation);

      const response = await sut.findOneAccountEmailByInvitationToken(
        projectInvitation.token
      );

      expect(response).toBe(accountBeingInvited.email);
    });
  });

  describe("findProjectNameByProjectId method", () => {
    it("should return the name column of given project id", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: false,
      };
      await connection("project").insert(project);

      const name = await sut.findProjectNameByProjectId(project.id);

      expect(name).toBe(project.name);
    });
  });

  describe("findProjectImageDataURL", () => {
    it("should return the image column of given project id", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: false,
        image: Buffer.from("image content", "base64"),
      };
      await connection("project").insert(project);

      const dataURL = await sut.findProjectImageDataURL(project.id);

      const expectedDataURL = `data:image/*;base64,${project.image.toString(
        "base64"
      )}`;
      expect(dataURL).toBe(expectedDataURL);
    });
  });

  describe("updateProjectImage method", () => {
    it("should update column image in the project table with given file", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      await connection("project").insert(project);
      const givenRequest = {
        projectId: project.id,
        fileBuffer: Buffer.from("image content"),
      };

      await sut.updateProjectImage(givenRequest);

      const insertedRow = await connection("project")
        .select("*")
        .where({
          id: project.id,
        })
        .first();
      expect(insertedRow.image).toStrictEqual(givenRequest.fileBuffer);
    });
  });

  describe("updateParticipantRole method", () => {
    it("should update a row in the account_project_project_role table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
        archived: true,
      };
      const { id: adminRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "admin" })
        .first();
      const { id: ownerRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "owner" })
        .first();
      const adminParticipant = {
        account_id: accountId,
        project_id: project.id,
        project_role_id: adminRoleId,
      };
      const ownerParticipant = {
        account_id: newAccount.id,
        project_id: project.id,
        project_role_id: ownerRoleId,
      };
      await connection("account").insert(newAccount);
      await connection("project").insert(project);
      await connection("account_project_project_role").insert(adminParticipant);
      await connection("account_project_project_role").insert(ownerParticipant);

      await sut.updateParticipantRole({
        projectId: project.id,
        roleName: "espectator",
        accountEmail,
      });

      const { id: espectatorRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "espectator" })
        .first();
      const storedParticipant = await connection("account_project_project_role")
        .select("*")
        .where({ account_id: accountId, project_id: project.id })
        .first();
      expect(storedParticipant.project_role_id).toBe(espectatorRoleId);
    });
  });

  describe("revokeInvitation method", () => {
    it("should remove a row in the project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
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
    it("should insert new row in the account_project_project_role table given invitation token and should remove row from project_invitation table", async () => {
      expect.assertions(2);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
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
      const insertedInvitationToken = await connection("project_invitation")
        .select("*")
        .where({
          token: projectInvitation.token,
        })
        .first();
      expect(insertedRow).toMatchObject(expectedParticipant);
      expect(insertedInvitationToken).toBeUndefined();
    });
  });

  describe("isInvitationTokenValid method", () => {
    it("should return true if token is found in the project_invitation table", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const project = {
        id: "project-id-0",
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
        title: "My issue",
        description: "My issue's description",
        order: 1,
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

  describe("listProjects and its helpers", () => {
    let project: any;
    let newAccount: any;
    let ownerParticipant: any;
    let memberParticipant: any;
    let issueGroup: any;
    let issue1: any;
    let issue2: any;
    let expectedFormattedIssues: Issue[];
    let expectedFormattedParticipants: Participant[];
    beforeEach(async () => {
      project = {
        id: "project-id-0",
        name: "My project",
        description: "My project's description",
      };
      const { id: ownerRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "owner" })
        .first();
      ownerParticipant = {
        project_id: project.id,
        account_id: accountId,
        project_role_id: ownerRoleId,
      };
      newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const { id: memberRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      memberParticipant = {
        project_id: project.id,
        account_id: newAccount.id,
        project_role_id: memberRoleId,
      };
      issueGroup = {
        id: "ig-id-0",
        project_id: project.id,
        title: "To do",
      };
      issue1 = {
        issue_group_id: issueGroup.id,
        id: "issue-id-0",
        title: "Issue title",
        description: "Issue description",
        completed: false,
        assigned_to_account_id: accountId,
        created_at: new Date().toISOString(),
        expires_at: undefined,
        order: 1,
      };
      issue2 = {
        issue_group_id: issueGroup.id,
        id: "issue-id-1",
        title: "Issue title",
        description: "Issue description",
        completed: true,
        assigned_to_account_id: newAccount.id,
        created_at: new Date().toISOString(),
        expires_at: undefined,
        order: 2,
      };
      await connection("issue_group").insert(issueGroup);
      await connection("issue").insert(issue1);
      await connection("issue").insert(issue2);
      await connection("project").insert(project);
      await connection("account").insert(newAccount);
      await connection("account_project_project_role").insert(ownerParticipant);
      await connection("account_project_project_role").insert(
        memberParticipant
      );

      expectedFormattedIssues = [
        {
          issueId: issue1.id,
          title: issue1.title,
          description: issue1.description,
          completed: issue1.completed,
          createdAt: new Date(issue1.created_at),
          expiresAt: issue1.expires_at,
          assignedToEmail: accountEmail,
          order: 1,
        } as unknown as Issue,
        {
          issueId: issue2.id,
          title: issue2.title,
          description: issue2.description,
          completed: issue2.completed,
          createdAt: new Date(issue2.created_at),
          expiresAt: issue2.expires_at,
          assignedToEmail: newAccount.email,
          order: 2,
        } as unknown as Issue,
      ];
      expectedFormattedParticipants = [
        {
          account: { name: accountName, image: null, email: accountEmail },
          role: { name: { value: "owner" } } as Role,
        } as Participant,
        {
          account: {
            name: newAccount.name,
            image: null,
            email: newAccount.email,
          },
          role: { name: { value: "member" } } as Role,
        } as Participant,
      ];
    });

    describe("listProjects method", () => {
      it.skip("should return an array of projects found in the project table joined with participants and issues", async () => {
        expect.assertions(1);

        const { sut } = makeSut();

        const response = await sut.listProjects(accountEmail);

        const expectedProject: Project = {
          projectId: project.id,
          name: project.name,
          description: project.description,
          createdAt: project.created_at,
          beginsAt: project.begins_at,
          finishesAt: project.finishes_at,
          participants: expectedFormattedParticipants,
          issueGroups: [
            {
              issueGroupId: issueGroup.id,
              title: issueGroup.title,
              issues: expectedFormattedIssues,
              shouldUpdateIssuesToCompleted: false,
            },
          ],
        } as Project;

        expect(response).toContainEqual(expectedProject);
      });
    });

    describe("listIssueGroupsByProjectId method", () => {
      it("should return an array of issueGroups found in the issue_group table associated with issues", async () => {
        expect.assertions(2);

        const { sut } = makeSut();
        const issueGroup1 = {
          id: "ig-id-1",
          project_id: project.id,
          title: "In progress",
        };
        await connection("issue_group").insert(issueGroup1);

        const response = await sut.listIssueGroupsByProjectId(project.id);

        const issueGroups: IssueGroup[] = [
          {
            title: issueGroup.title,
            issueGroupId: issueGroup.id,
            issues: expectedFormattedIssues,
            shouldUpdateIssuesToCompleted: false,
          },
          {
            issues: [],
            title: issueGroup1.title,
            issueGroupId: issueGroup1.id,
            shouldUpdateIssuesToCompleted: false,
          },
        ];

        expect(response).toContainEqual(
          expect.objectContaining(issueGroups[0])
        );
        expect(response).toContainEqual(
          expect.objectContaining(issueGroups[1])
        );
      });
    });

    describe("listIssuesByIssueGroupId method", () => {
      it("should return an array of issues found in the issue table", async () => {
        expect.assertions(2);

        const { sut } = makeSut();

        const response = await sut.listIssuesByIssueGroupId(issueGroup.id);

        expect(response).toContainEqual(expectedFormattedIssues[0]);
        expect(response).toContainEqual(expectedFormattedIssues[1]);
      });
    });

    describe("listParticipantsByProjectId method", () => {
      it("should return an array of participants found in the account_project_project_role table", async () => {
        expect.assertions(2);

        const { sut } = makeSut();

        const response = await sut.listParticipantsByProjectId(project.id);

        expect(response).toContainEqual(expectedFormattedParticipants[0]);
        expect(response).toContainEqual(expectedFormattedParticipants[1]);
      });
    });
  });

  describe("updateProject method", () => {
    it("should update a project", async () => {
      expect.assertions(1);

      const { sut } = makeSut();
      const projectId = "project-id-0";
      await connection("project").insert({
        id: projectId,
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
