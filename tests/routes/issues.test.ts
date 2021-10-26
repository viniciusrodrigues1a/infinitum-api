import { jwtToken } from "@modules/account/infra/authentication";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
import { NotFutureDateError } from "@shared/entities/errors";
import { configuration, connection } from "@shared/infra/database/connection";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { api, defaultLanguage } from "../helpers";

describe("/issues/ endpoint", () => {
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
      const {
        body: { id },
      } = await api
        .post("/projects/")
        .set({ authorization: `Bearer ${authorizationToken}` })
        .send({
          name: "my project",
          description: "my project's description",
        });
      projectId = id;
    });

    it("should return 201 with the issue's id", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        projectId,
        title: "In progress",
        description: "Issues that are still in progress",
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 404 if project cannot be found", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        projectId: "project-id-182373128",
        title: "In progress",
        description: "Issues that are still in progress",
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(404);
      const expectedBodyMessage = new ProjectNotFoundError(
        givenBody.projectId,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if account doesn't participate in project", async () => {
      expect.assertions(2);

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
        description: "Issues that are still in progress",
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new NotParticipantInProjectError(
        notParticipantEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if project hasnt begun yet", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const nowMs = new Date().getTime();
      const tomorrowIso = new Date(nowMs + 86400 * 1000).toISOString();
      const {
        body: { id },
      } = await api
        .post("/projects/")
        .set({ authorization: `Bearer ${authorizationToken}` })
        .send({
          name: "my project",
          description: "my project's description",
          beginsAt: tomorrowIso,
        });
      const givenBody = {
        projectId: id,
        title: "In progress",
        description: "Issues that are still in progress",
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new ProjectHasntBegunError(defaultLanguage)
        .message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if project is archived", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        projectId,
        title: "In progress",
        description: "Issues that are still in progress",
      };
      await connection("project")
        .update({ archived: true })
        .where({ id: projectId });

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new ProjectIsArchivedError(defaultLanguage)
        .message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 400 if expiresAt date is in the past", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const nowMs = new Date().getTime();
      const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
      const givenBody = {
        projectId,
        title: "In progress",
        description: "Issues that are still in progress",
        expiresAt: yesterdayIso,
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);
      const a = new Date(yesterdayIso);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new NotFutureDateError(a, defaultLanguage)
        .message;

      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });
});
