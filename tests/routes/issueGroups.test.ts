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
});
