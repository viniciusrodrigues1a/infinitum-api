import { jwtToken } from "@modules/account/infra/authentication";
import { configuration, connection } from "@shared/infra/database/connection";
import { api } from "../helpers";

describe("/issueGroups/ endpoint", () => {
  let authorizationToken: string;
  let accountId: string;

  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

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
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("method POST /", () => {
    let projectId: string;
    beforeEach(async () => {
      await api
        .post("/projects/")
        .set({ authorization: `Bearer ${authorizationToken}` })
        .send({
          name: "my project",
          description: "my project's description",
        });

      const { id } = await connection("project")
        .select("id")
        .where({ name: "my project" })
        .first();
      projectId = id;
    });

    it("should return 201 with issue group's id", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        projectId,
        title: "In progress",
      };

      const response = await api
        .post("/issueGroups/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 404 if project cannot be found", async () => {
      expect.assertions(1);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        projectId: "project-id-1213312",
        title: "In progress",
      };

      const response = await api
        .post("/issueGroups/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(404);
    });

    it("should return 400 if account doesn't participate in project", async () => {
      expect.assertions(1);

      const notParticipantEmail = "notparticipant@email.com";
      await connection("account").insert({
        id: "account-id-1",
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
      const givenBody = {
        projectId,
        title: "In progress",
      };

      const response = await api
        .post("/issueGroups/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
    });

    it("should return 401 if participant role doesn't have permission", async () => {
      expect.assertions(1);

      const givenAuthHeader = {
        authorization: `Bearer ${authorizationToken}`,
      };
      const givenBody = {
        projectId,
        title: "In progress",
      };
      const roleName = "espectator";
      const { id: espectatorRoleId } = await connection("project_role")
        .select("id")
        .where({ name: roleName })
        .first();
      await connection("account_project_project_role")
        .update({
          project_role_id: espectatorRoleId,
        })
        .where({ account_id: accountId });

      const response = await api
        .post("/issueGroups/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(401);
    });
  });

  describe("methods that require for an issueGroup to be already created", () => {
    let projectId: string;
    let issueGroupId: string;

    beforeEach(async () => {
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
      const { id: roleId } = await connection("project_role")
        .select("id")
        .where({ name: "owner" })
        .first();
      const participant = {
        project_role_id: roleId,
        project_id: project.id,
        account_id: accountId,
      };
      await connection("project").insert(project);
      await connection("issue_group").insert(issueGroup);
      await connection("account_project_project_role").insert(participant);

      projectId = project.id;
      issueGroupId = issueGroup.id;
    });

    afterEach(async () => {
      await connection.migrate.rollback(configuration.migrations);
    });

    describe("method DELETE /", () => {
      it("should return 204", async () => {
        expect.assertions(1);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .delete(`/issueGroups/${issueGroupId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(204);
      });

      it("should return 404 if issueGroup cannot be found", async () => {
        expect.assertions(1);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const inexistentIssueGroupId = "3129087321032170312";

        const response = await api
          .delete(`/issueGroups/${inexistentIssueGroupId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(404);
      });

      it("should return 400 if account authorized doesn't participant in project", async () => {
        expect.assertions(1);

        const account = {
          id: "account-id-124521",
          name: "amy",
          email: "amy@email.com",
          password_hash: "hash",
          salt: "salt",
          iterations: 1,
        };
        await connection("account").insert(account);
        const authorizationTokenWithDifferentEmail = jwtToken.sign({
          email: account.email,
        });
        const givenAuthHeader = {
          authorization: `Bearer ${authorizationTokenWithDifferentEmail}`,
        };

        const response = await api
          .delete(`/issueGroups/${issueGroupId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(400);
      });

      it("should return 401 if account authorized doesn't enough permission in project", async () => {
        expect.assertions(1);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const { id: roleId } = await connection("project_role")
          .select("id")
          .where({ name: "espectator" })
          .first();
        await connection("account_project_project_role")
          .update({
            project_role_id: roleId,
          })
          .where({ account_id: accountId, project_id: projectId });

        const response = await api
          .delete(`/issueGroups/${issueGroupId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(401);
      });
    });
  });
});
