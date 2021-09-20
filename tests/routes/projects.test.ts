import { jwtToken } from "@modules/account/infra/authentication";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { NotFutureDateError } from "@shared/entities/errors";
import { configuration, connection } from "@shared/infra/database/connection";
import { MissingParamsError } from "@shared/presentation/errors";
import { api, defaultLanguage } from "../helpers";

describe("/projects/ endpoint", () => {
  let authorizationToken = "";

  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);

    const accountEmail = "jorge@email.com";
    await connection("account").insert({
      id: "account-id-0",
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
    it("should return 204", async () => {
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

      expect(response.statusCode).toBe(204);
    });

    it("should return 204 when provided with beginsAt and finishesAt", async () => {
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

      expect(response.statusCode).toBe(204);
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
        [defaultLanguage.getMissingParamsErrorNameParamMessage()],
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
      const expectedBody = new MissingParamsError(
        [defaultLanguage.getMissingParamsErrorDescriptionParamMessage()],
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
      const expectedBody = new MissingParamsError(
        [
          defaultLanguage.getMissingParamsErrorNameParamMessage(),
          defaultLanguage.getMissingParamsErrorDescriptionParamMessage(),
        ],
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBody);
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
});
