import { jwtToken } from "@modules/account/infra/authentication";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { OwnerCantBeUsedAsARoleForAnInvitationError } from "@modules/project/entities/errors/OwnerCantBeUsedAsARoleForAnInvitationError";
import {
  AccountAlreadyParticipatesInProjectError,
  AccountHasAlreadyBeenInvitedError,
} from "@modules/project/use-cases/errors";
import { InvalidInvitationTokenError } from "@modules/project/use-cases/errors/InvalidInvitationTokenError";
import { configuration, connection } from "@shared/infra/database/connection";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import { api, defaultLanguage } from "../helpers";

describe("/invitations/ endpoint", () => {
  let authorizationToken: string;
  let accountId: string;
  let projectId: string;
  let projectName: string;
  let accountBeingInvitedEmail: string;
  let invitationToken: string;

  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    // inserting account
    accountId = "account-id-0";
    const accountEmail = "jorge@email.com";
    await connection("account").insert({
      id: accountId,
      name: "jorge",
      email: accountEmail,
      password_hash: "hash",
      salt: "salt",
      iterations: 1,
    });

    authorizationToken = jwtToken.sign({ email: accountEmail });

    // inserting project
    projectName = "my project";
    await api
      .post("/projects/")
      .set({ authorization: `Bearer ${authorizationToken}` })
      .send({
        name: projectName,
        description: "my project's description",
      });

    const { id } = await connection("project")
      .select("id")
      .where({ name: "my project" })
      .first();
    projectId = id;

    // inserting project_invitation
    accountBeingInvitedEmail = "user9412724@email.com";
    const newAccount = {
      id: "account-id-93124793127412",
      email: accountBeingInvitedEmail,
      name: "user 9412724",
      password_hash: "hash",
      salt: "salt",
      iterations: 1,
    };
    const { id: roleId } = await connection("project_role")
      .select("id")
      .where({ name: "member" })
      .first();

    invitationToken = "invitationToken-0";
    const projectInvitation = {
      account_id: newAccount.id,
      project_id: projectId,
      project_role_id: roleId,
      token: invitationToken,
    };
    await connection("account").insert(newAccount);
    await connection("project_invitation").insert(projectInvitation);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("method DELETE /", () => {
    it("should return 204", async () => {
      expect.assertions(1);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };

      const response = await api
        .delete("/invitations/")
        .set(givenAuthHeader)
        .send({
          projectId,
          accountEmail: accountBeingInvitedEmail,
        });

      expect(response.statusCode).toBe(204);
    });

    it("should return 404 if project cannot be found", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };

      const response = await api
        .delete("/invitations/")
        .set(givenAuthHeader)
        .send({
          projectId: "inexistent-project-id-12394721412",
          accountEmail: accountBeingInvitedEmail,
        });

      expect(response.statusCode).toBe(404);
      const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
        .message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if authorized user doesn't participate in project", async () => {
      expect.assertions(2);

      const notParticipantEmail = "notparticipant@email.com";
      await connection("account").insert({
        id: "account-id-2",
        name: "jorge",
        email: notParticipantEmail,
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });
      const authorizationTokenWithDifferentEmail = jwtToken.sign({
        email: notParticipantEmail,
      });
      const givenAuthHeader = {
        authorization: `Bearer ${authorizationTokenWithDifferentEmail}`,
      };

      const response = await api
        .delete("/invitations/")
        .set(givenAuthHeader)
        .send({
          projectId,
          accountEmail: "user123978@email.com",
        });

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new NotParticipantInProjectError(
        notParticipantEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 401 if authorized user doesn't have enough permission", async () => {
      expect.assertions(2);

      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      const authorizationTokenWithDifferentEmail = jwtToken.sign({
        email: newAccount.email,
      });
      const givenAuthHeader = {
        authorization: `Bearer ${authorizationTokenWithDifferentEmail}`,
      };
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      await connection("account").insert(newAccount); // create new account
      await connection("account_project_project_role").insert({
        // make new account participant of already existent project
        project_role_id: roleId,
        account_id: newAccount.id,
        project_id: projectId,
      });
      await connection("account_project_project_role") // change authenticated account role to member so it doesn't have enough permission
        .update({ project_role_id: roleId })
        .where({ account_id: accountId });

      const response = await api
        .delete("/invitations/")
        .set(givenAuthHeader)
        .send({
          projectId,
          accountEmail: "user123978@email.com",
        });

      expect(response.statusCode).toBe(401);
      const expectedBodyMessage = new RoleInsufficientPermissionError(
        "member",
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });

  describe("method POST /kick/", () => {
    it("should return 204", async () => {
      expect.assertions(1);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
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
      await connection("account").insert(newAccount);
      await connection("account_project_project_role").insert({
        project_role_id: roleId,
        account_id: newAccount.id,
        project_id: projectId,
      });

      const response = await api
        .post("/invitations/kick/")
        .set(givenAuthHeader)
        .send({
          projectId,
          accountEmail: newAccount.email,
        });

      expect(response.statusCode).toBe(204);
    });

    it("should return 404 if project cannot be found", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      await connection("account").insert(newAccount);

      const response = await api
        .post("/invitations/kick/")
        .set(givenAuthHeader)
        .send({
          projectId: "inexistent-project-id-192376421967",
          accountEmail: newAccount.email,
        });

      expect(response.statusCode).toBe(404);
      const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
        .message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if account is not a participant of given project id", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const newAccount = {
        id: "account-id-123421",
        email: "newaccount@email.com",
        name: "new account",
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      };
      await connection("account").insert(newAccount);

      const response = await api
        .post("/invitations/kick/")
        .set(givenAuthHeader)
        .send({
          projectId,
          accountEmail: newAccount.email,
        });

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new NotParticipantInProjectError(
        newAccount.email,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 401 if user doesn't have enough permission", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
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
      await connection("account").insert(newAccount); // create new account
      await connection("account_project_project_role").insert({
        // make new account participant of already existent project
        project_role_id: roleId,
        account_id: newAccount.id,
        project_id: projectId,
      });
      await connection("account_project_project_role") // change authenticated account role to member so it doesn't have enough permission
        .update({ project_role_id: roleId })
        .where({ account_id: accountId });

      const response = await api
        .post("/invitations/kick/")
        .set(givenAuthHeader)
        .send({
          projectId,
          accountEmail: newAccount.email,
        });

      expect(response.statusCode).toBe(401);
      const expectedBodyMessage = new RoleInsufficientPermissionError(
        newAccount.email,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });

  describe("method POST /accept/:invitationToken", () => {
    it("should return 204", async () => {
      expect.assertions(1);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };

      const response = await api
        .post(`/invitations/accept/${invitationToken}`)
        .set(givenAuthHeader);

      expect(response.statusCode).toBe(204);
    });

    it("should return 400 if token is not valid", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };

      const response = await api
        .post(`/invitations/accept/invalid-invitationToken-0`)
        .set(givenAuthHeader);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new InvalidInvitationTokenError(
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });

  describe("method POST /", () => {
    let accountToBeInvitedId: string;
    let accountToBeInvitedEmail: string;
    beforeEach(async () => {
      accountToBeInvitedId = "account-id-1";
      accountToBeInvitedEmail = "garcia@email.com";
      await connection("account").insert({
        id: accountToBeInvitedId,
        name: "garcia",
        email: accountToBeInvitedEmail,
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });
    });

    it("should return 204", async () => {
      expect.assertions(1);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const givenRequest = {
        roleName: "member",
        projectId,
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(204);
    });

    it("should return 404 if project cannot be found", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const givenRequest = {
        roleName: "member",
        projectId: "non-existent-project-id-01237340127",
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(404);
      const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
        .message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 404 if account to be invited cannot be found", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const givenRequest = {
        roleName: "member",
        projectId,
        projectName,
        accountEmail: "non-existent-email1239873129@email.com",
      };

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(404);
      const expectedBodyMessage = new AccountNotFoundError(
        givenRequest.accountEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if authorized user doesn't participate in given project", async () => {
      expect.assertions(2);

      const notParticipantEmail = "notparticipant@email.com";
      await connection("account").insert({
        id: "account-id-2",
        name: "jorge",
        email: notParticipantEmail,
        password_hash: "hash",
        salt: "salt",
        iterations: 1,
      });
      const authorizationTokenWithDifferentEmail = jwtToken.sign({
        email: notParticipantEmail,
      });
      const givenAuthHeader = {
        authorization: `Bearer ${authorizationTokenWithDifferentEmail}`,
      };
      const givenRequest = {
        roleName: "member",
        projectId,
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new NotParticipantInProjectError(
        notParticipantEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if user already participates in given project", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const { id: memberRoleId } = await connection("project_role")
        .select("id")
        .where({ name: "member" })
        .first();
      await connection("account_project_project_role").insert({
        project_role_id: memberRoleId,
        account_id: accountToBeInvitedId,
        project_id: projectId,
      });
      const givenRequest = {
        roleName: "member",
        projectId,
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new AccountAlreadyParticipatesInProjectError(
        accountToBeInvitedEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if project has already been invited", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const givenRequest = {
        roleName: "member",
        projectId,
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };
      await api.post("/invitations/").set(givenAuthHeader).send(givenRequest);

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new AccountHasAlreadyBeenInvitedError(
        accountToBeInvitedEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if account is being invited for the owner role", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const givenRequest = {
        roleName: "owner",
        projectId,
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage =
        new OwnerCantBeUsedAsARoleForAnInvitationError(defaultLanguage).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 401 if account making the invitation doesn't have a role with sufficient permission", async () => {
      expect.assertions(2);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const roleName = "member";
      const givenRequest = {
        roleName,
        projectId,
        projectName,
        accountEmail: accountToBeInvitedEmail,
      };
      const { id: memberRoleId } = await connection("project_role")
        .select("id")
        .where({ name: roleName })
        .first();
      await connection("account_project_project_role")
        .update({ project_role_id: memberRoleId })
        .where({ account_id: accountId });

      const response = await api
        .post("/invitations/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(401);
      const expectedBodyMessage = new RoleInsufficientPermissionError(
        roleName,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });
});
