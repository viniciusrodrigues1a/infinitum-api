import { jwtToken } from "@modules/account/infra/authentication";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { BeginsAtMustBeBeforeFinishesAtError } from "@modules/project/entities/errors";
import { OwnerCantBeUsedAsARoleForAnInvitationError } from "@modules/project/entities/errors/OwnerCantBeUsedAsARoleForAnInvitationError";
import {
  AccountAlreadyParticipatesInProjectError,
  AccountHasAlreadyBeenInvitedError,
} from "@modules/project/use-cases/errors";
import { NotFutureDateError } from "@shared/entities/errors";
import { configuration, connection } from "@shared/infra/database/connection";
import {
  InvalidParamError,
  MissingParamsError,
} from "@shared/presentation/errors";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
} from "@shared/use-cases/errors";
import { RoleInsufficientPermissionError } from "@shared/use-cases/errors/RoleInsufficientPermissionError";
import { api, defaultLanguage } from "../helpers";

describe("/projects/ endpoint", () => {
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

  describe("method POST", () => {
    it("should return 201", async () => {
      expect.assertions(1);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        name: "my project",
        description: "my project's description",
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(201);
    });

    it("should return 201 when provided with beginsAt and finishesAt", async () => {
      expect.assertions(1);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const nowMs = new Date().getTime();
      const finishesAt = new Date(nowMs + 86400 * 1000);
      const givenBody = {
        name: "my project",
        description: "my project's description",
        beginsAt: new Date(),
        finishesAt,
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(201);
    });

    it("should return 400 if finishesAt date is in the past", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const nowMs = new Date().getTime();
      const finishesAt = new Date(nowMs - 86400 * 1000);
      const givenBody = {
        name: "my project",
        description: "my project's description",
        beginsAt: new Date(),
        finishesAt,
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBody = new NotFutureDateError(
        givenBody.finishesAt,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBody);
    });

    it("should return 400 if name is invalid", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        description: "my project's description",
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBody = new MissingParamsError(
        [defaultLanguage.getNameParamMessage()],
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBody);
    });

    it("should return 400 if description is invalid", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        name: "my project",
        description: 12345,
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const expectedBody = new InvalidParamError(
        defaultLanguage.getDescriptionParamMessage(),
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBody);
    });

    it("should return 400 if name and description is invalid", async () => {
      expect.assertions(2);

      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenBody = {
        name: [1, 2, 3],
        description: 12345,
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(400);
      const invalidNameParamBodyMessage = new InvalidParamError(
        defaultLanguage.getNameParamMessage(),
        defaultLanguage
      ).message;
      const invalidDescriptionParamBodyMessage = new InvalidParamError(
        defaultLanguage.getNameParamMessage(),
        defaultLanguage
      ).message;
      const oneOfTwoMessages =
        response.body.error.message === invalidNameParamBodyMessage ||
        response.body.error.message === invalidDescriptionParamBodyMessage;
      expect(oneOfTwoMessages).toBeTruthy();
    });

    it("should return 404 if account doesn't exist", async () => {
      expect.assertions(2);

      const accountEmail = "notexistent@email.com";
      const authorizationTokenWithInvalidEmail = jwtToken.sign({
        email: accountEmail,
      });
      const givenAuthHeader = {
        authorization: `Bearer ${authorizationTokenWithInvalidEmail}`,
      };
      const givenBody = {
        name: "my project",
        description: "my project's description",
      };

      const response = await api
        .post("/projects/")
        .set(givenAuthHeader)
        .send(givenBody);

      expect(response.statusCode).toBe(404);
      const expectedBody = new AccountNotFoundError(
        accountEmail,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBody);
    });
  });

  describe("routes that require a project being already inserted", () => {
    let projectId: string;
    let projectName: string;
    beforeEach(async () => {
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
    });

    describe("method POST /invitation", () => {
      let invitedAccountId: string;
      let invitedAccountEmail: string;
      beforeEach(async () => {
        invitedAccountId = "account-id-1";
        invitedAccountEmail = "garcia@email.com";
        await connection("account").insert({
          id: invitedAccountId,
          name: "garcia",
          email: invitedAccountEmail,
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
          accountEmail: invitedAccountEmail,
        };

        const response = await api
          .post("/projects/invitation")
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
          accountEmail: invitedAccountEmail,
        };

        const response = await api
          .post("/projects/invitation")
          .set(givenAuthHeader)
          .send(givenRequest);

        expect(response.statusCode).toBe(404);
        const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
          .message;
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if authenticated user doesn't participate in given project", async () => {
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
          accountEmail: invitedAccountEmail,
        };

        const response = await api
          .post("/projects/invitation")
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
          account_id: invitedAccountId,
          project_id: projectId,
        });
        const givenRequest = {
          roleName: "member",
          projectId,
          projectName,
          accountEmail: invitedAccountEmail,
        };

        const response = await api
          .post("/projects/invitation")
          .set(givenAuthHeader)
          .send(givenRequest);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage =
          new AccountAlreadyParticipatesInProjectError(
            invitedAccountEmail,
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
          accountEmail: invitedAccountEmail,
        };
        await api
          .post("/projects/invitation")
          .set(givenAuthHeader)
          .send(givenRequest);

        const response = await api
          .post("/projects/invitation")
          .set(givenAuthHeader)
          .send(givenRequest);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage = new AccountHasAlreadyBeenInvitedError(
          invitedAccountEmail,
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
          accountEmail: invitedAccountEmail,
        };

        const response = await api
          .post("/projects/invitation")
          .set(givenAuthHeader)
          .send(givenRequest);

        expect(response.statusCode).toBe(400);
        const expectedBodyMessage =
          new OwnerCantBeUsedAsARoleForAnInvitationError(defaultLanguage)
            .message;
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
          accountEmail: invitedAccountEmail,
        };
        const { id: memberRoleId } = await connection("project_role")
          .select("id")
          .where({ name: roleName })
          .first();
        await connection("account_project_project_role")
          .update({ project_role_id: memberRoleId })
          .where({ account_id: accountId });

        const response = await api
          .post("/projects/invitation")
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

    describe("method DELETE /", () => {
      it("should return 204", async () => {
        expect.assertions(1);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .delete(`/projects/${projectId}`)
          .set(givenAuthHeader);

        expect(response.statusCode).toBe(204);
      });

      it("should return 404 if project cannot be found", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .delete("/projects/invalid-id")
          .set(givenAuthHeader);

        const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
          .message;
        expect(response.statusCode).toBe(404);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if authenticated user doesn't participate in project", async () => {
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
          .delete(`/projects/${projectId}`)
          .set(givenAuthHeader);

        const expectedBodyMessage = new NotParticipantInProjectError(
          notParticipantEmail,
          defaultLanguage
        ).message;
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };
        await api.post("/projects/").set(givenAuthHeader).send({
          name: "my project",
          description: "my project's description",
        });
        const roleName = "member";
        const { id: memberRoleId } = await connection("project_role")
          .select("id")
          .where({ name: roleName })
          .first();
        await connection("account_project_project_role").update({
          project_role_id: memberRoleId,
        });

        const response = await api
          .delete(`/projects/${projectId}`)
          .set(givenAuthHeader);

        const expectedBodyMessage = new RoleInsufficientPermissionError(
          roleName,
          defaultLanguage
        ).message;
        expect(response.statusCode).toBe(401);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });
    });

    describe("method PUT /:id", () => {
      it("should return 204", async () => {
        expect.assertions(1);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .put(`/projects/${projectId}`)
          .set(givenAuthHeader)
          .send({ name: "Updated project name" });

        expect(response.statusCode).toBe(204);
      });

      it("should return 404 if project doesn't exist", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const invalidId = "732545";
        const response = await api
          .put(`/projects/${invalidId}`)
          .set(givenAuthHeader)
          .send({ name: "Updated project name" });

        const expectedBodyMessage = new ProjectNotFoundError(defaultLanguage)
          .message;
        expect(response.statusCode).toBe(404);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 401 if authenticated user doesn't belong to project", async () => {
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
          .put(`/projects/${projectId}`)
          .set(givenAuthHeader)
          .send({ name: "Updated project name" });

        const expectedBodyMessage = new NotParticipantInProjectError(
          notParticipantEmail,
          defaultLanguage
        ).message;
        expect(response.statusCode).toBe(401);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 401 if authenticated user doesn't have permission", async () => {
        expect.assertions(2);

        const roleName = "member";
        const { id: memberRoleId } = await connection("project_role")
          .select("id")
          .where({ name: roleName })
          .first();
        await connection("account_project_project_role")
          .update({
            project_role_id: memberRoleId,
          })
          .where({ account_id: accountId });
        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api
          .put(`/projects/${projectId}`)
          .set(givenAuthHeader)
          .send({ name: "Updated project name" });

        const expectedBodyMessage = new RoleInsufficientPermissionError(
          roleName,
          defaultLanguage
        ).message;
        expect(response.statusCode).toBe(401);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if finishesAt is not in the future", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const yesterday = new Date(new Date().getTime() - 86400 * 1000);
        const response = await api
          .put(`/projects/${projectId}`)
          .set(givenAuthHeader)
          .send({
            name: "Updated project name",
            finishesAt: yesterday.toISOString(),
          });

        const expectedBodyMessage = new NotFutureDateError(
          yesterday,
          defaultLanguage
        ).message;
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });

      it("should return 400 if finishesAt is due before beginsAt", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const now = new Date().getTime();
        const dayInMs = 86400 * 1000;
        const tomorrow = new Date(now + dayInMs);
        const nextWeek = new Date(now + dayInMs * 7);
        const response = await api
          .put(`/projects/${projectId}`)
          .set(givenAuthHeader)
          .send({
            name: "Updated project name",
            beginsAt: nextWeek.toISOString(),
            finishesAt: tomorrow.toISOString(),
          });

        const expectedBodyMessage = new BeginsAtMustBeBeforeFinishesAtError(
          defaultLanguage
        ).message;
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe(expectedBodyMessage);
      });
    });

    describe("method GET /", () => {
      it("should return 200", async () => {
        expect.assertions(2);

        const givenAuthHeader = {
          authorization: `Bearer ${authorizationToken}`,
        };

        const response = await api.get("/projects").set(givenAuthHeader);

        expect(response.body[0].projectId).toBe(projectId);
        expect(response.statusCode).toBe(200);
      });
    });
  });
});
