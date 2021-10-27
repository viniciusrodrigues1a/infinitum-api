import { jwtToken } from "@modules/account/infra/authentication";
import { IssueNotFoundError } from "@modules/issue/use-cases/errors";
import {
  ProjectHasntBegunError,
  ProjectIsArchivedError,
} from "@modules/project/use-cases/errors";
import { NotFutureDateError } from "@shared/entities/errors";
import { configuration, connection } from "@shared/infra/database/connection";
import {
  InvalidParamError,
  MissingParamsError,
  NoParamProvidedError,
} from "@shared/presentation/errors";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import { api, defaultLanguage } from "../helpers";

describe("/issues/ endpoint", () => {
  let authorizationToken: string;
  let accountId: string;
  let issueGroupId: string;
  let projectId: string;

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

    const authHeader = { authorization: `Bearer ${authorizationToken}` };

    const projectsResponse = await api.post("/projects/").set(authHeader).send({
      name: "my project",
      description: "my project's description",
    });
    projectId = projectsResponse.body.id;

    const issueGroupsResponse = await api
      .post("/issueGroups/")
      .set(authHeader)
      .send({ projectId, title: "My issue" });
    issueGroupId = issueGroupsResponse.body.id;
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("routes with an issue already created", () => {
    let issueId: string;
    beforeEach(async () => {
      const {
        body: { id },
      } = await api
        .post("/issues/")
        .set({ authorization: `Bearer ${authorizationToken}` })
        .send({
          issueGroupId,
          title: "My issue",
          description: "My issue's description",
        });
      issueId = id;
    });

    describe("method DELETE /", () => {
      it("should return 204", async () => {
        expect.assertions(1);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .delete(`/issues/${issueId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(204);
      });

      it("should return 404 if issue cannot be found", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .delete("/issues/issue-id-1233124421512")
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(404);
        const expectedBodyMessage = new IssueNotFoundError(defaultLanguage)
          .message;
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

        const response = await api
          .delete(`/issues/${issueId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new NotParticipantInProjectError(
          notParticipantEmail,
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 401 if participant doesn't have sufficient permission", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          issueGroupId,
          title: "My issue",
          description: "My issue's description",
          expiresAt: yesterdayIso,
        };
        const roleName = "espectator";
        const { id: memberRoleId } = await connection("project_role")
          .select("id")
          .where({ name: roleName })
          .first();
        await connection("account_project_project_role")
          .update({
            project_role_id: memberRoleId,
          })
          .where({ account_id: accountId });

        const response = await api
          .delete(`/issues/${issueId}`)
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(401);
        const expectedBodyMessage = new RoleInsufficientPermissionError(
          roleName,
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });
    });
  });

  describe("method POST /", () => {
    describe("params validation", () => {
      it("should return 400 if title is missing", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          issueGroupId,
          description: "My issue's description",
          expiresAt: yesterdayIso,
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new MissingParamsError(
          [defaultLanguage.getTitleParamMessage()],
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if title is not a string", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          issueGroupId,
          title: 1213312,
          description: "My issue's description",
          expiresAt: yesterdayIso,
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new InvalidParamError(
          defaultLanguage.getTitleParamMessage(),
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if description is missing", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          issueGroupId,
          title: "My issue",
          expiresAt: yesterdayIso,
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new MissingParamsError(
          [defaultLanguage.getDescriptionParamMessage()],
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if description is not a string", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          issueGroupId,
          title: "My issue",
          description: 1213312,
          expiresAt: yesterdayIso,
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new InvalidParamError(
          defaultLanguage.getDescriptionParamMessage(),
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if expiresAt is not a valid date", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const givenBody = {
          issueGroupId,
          title: "My issue",
          description: "My issue's description",
          expiresAt: "not a valid date",
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new InvalidParamError(
          defaultLanguage.getExpiresAtParamMessage(),
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if issueGroupId is missing", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          title: "My issue",
          description: "My issue's description",
          expiresAt: yesterdayIso,
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new MissingParamsError(
          [defaultLanguage.getIssueGroupIdParamMessage()],
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if issueGroupId is not a string", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const nowMs = new Date().getTime();
        const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
        const givenBody = {
          issueGroupId: [123, 456],
          title: "My issue",
          description: "My issue's description",
          expiresAt: yesterdayIso,
        };

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new InvalidParamError(
          defaultLanguage.getIssueGroupIdParamMessage(),
          defaultLanguage
        ).message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if body is empty", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        const givenBody = {};

        const response = await api
          .post("/issues/")
          .set(givenAuthHeader)
          .send(givenBody);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new NoParamProvidedError(defaultLanguage)
          .message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });
    });

    it("should return 201 with the issue's id", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        issueGroupId,
        title: "My issue",
        description: "My issue's description",
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
        issueGroupId: "ig-id-182373128",
        title: "My issue",
        description: "My issue's description",
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(404);
      const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
        .message;
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
        issueGroupId,
        title: "My issue",
        description: "My issue's description",
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
        body: { id: projectThatHasntBegunId },
      } = await api.post("/projects/").set(givenAuthHeader).send({
        name: "my project",
        description: "my project's description",
        beginsAt: tomorrowIso,
      });
      const {
        body: { id },
      } = await api
        .post("/issueGroups/")
        .set(givenAuthHeader)
        .send({ projectId: projectThatHasntBegunId, title: "My issue" });
      const givenBody = {
        issueGroupId: id,
        title: "My issue",
        description: "My issue's description",
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
        issueGroupId,
        title: "My issue",
        description: "My issue's description",
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
        issueGroupId,
        title: "My issue",
        description: "My issue's description",
        expiresAt: yesterdayIso,
      };

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new NotFutureDateError(
        new Date(yesterdayIso),
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });

    it("should return 401 if participant doesn't have sufficient permission", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const nowMs = new Date().getTime();
      const yesterdayIso = new Date(nowMs - 86400 * 1000).toISOString();
      const givenBody = {
        issueGroupId,
        title: "My issue",
        description: "My issue's description",
        expiresAt: yesterdayIso,
      };
      const roleName = "espectator";
      const { id: memberRoleId } = await connection("project_role")
        .select("id")
        .where({ name: roleName })
        .first();
      await connection("account_project_project_role")
        .update({
          project_role_id: memberRoleId,
        })
        .where({ account_id: accountId });

      const response = await api
        .post("/issues/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(401);
      const expectedBodyMessage = new RoleInsufficientPermissionError(
        roleName,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });
});
