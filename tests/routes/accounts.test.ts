import { jwtToken } from "@modules/account/infra/authentication";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { configuration, connection } from "@shared/infra/database/connection";
import path from "path";
import { api, defaultLanguage } from "../helpers";

describe("/accounts/ endpoint", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("find one account endpoint", () => {
    it("should return 200", async () => {
      expect.assertions(2);

      const queryEmail = "jorge@email.com";
      await api
        .post("/auth/register/")
        .send({ name: "jorge", email: queryEmail, password: "jorgepa55" });

      const response = await api.get(`/accounts/?email=${queryEmail}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe(queryEmail);
    });

    it("should return 404", async () => {
      expect.assertions(1);

      const queryEmail = "nonexistent@email.com";

      const response = await api.get(`/accounts/?email=${queryEmail}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("update account endpoint", () => {
    it("should return 204", async () => {
      expect.assertions(2);

      const account = {
        name: "jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send(account);
      const authorizationToken = jwtToken.sign({ email: account.email });
      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenRequest = {
        name: "Julio",
        email: "julio@email.com",
      };

      const response = await api
        .patch("/accounts/")
        .set(givenAuthHeader)
        .send(givenRequest);

      const updatedAccountResponse = await api.get(
        `/accounts/?email=${givenRequest.email}`
      );

      expect(response.statusCode).toBe(204);
      expect(updatedAccountResponse.body).toStrictEqual(
        expect.objectContaining({
          name: givenRequest.name,
          email: givenRequest.email,
        })
      );
    });

    it("should return 204 and update an account's image", async () => {
      expect.assertions(2);

      const account = {
        name: "jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send(account);
      const authorizationToken = jwtToken.sign({ email: account.email });
      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };

      const response = await api
        .patch("/accounts/")
        .set(givenAuthHeader)
        .attach("file", path.resolve(__dirname, "cat.jpg"));

      const updatedAccount = await connection("account")
        .where({ email: account.email })
        .select("*")
        .first();
      expect(response.statusCode).toBe(204);
      expect(updatedAccount.image).not.toBeNull();
    });

    it("should return 204 and update an account's language", async () => {
      expect.assertions(2);

      const account = {
        name: "jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send(account);
      const authorizationToken = jwtToken.sign({ email: account.email });
      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const { id: languageId } = await connection("language")
        .where({ iso_code: "es-ES" })
        .select("*")
        .first();

      const response = await api
        .patch("/accounts/")
        .set(givenAuthHeader)
        .field("languageId", languageId);

      await new Promise((resolve) => {
        // by some reason the query below runs before the db update, so wait 100ms
        setTimeout(resolve, 100);
      });

      const updatedAccount = await connection("account")
        .where({ email: account.email })
        .select("*")
        .first();
      expect(response.statusCode).toBe(204);
      expect(updatedAccount.language_id).toBe(languageId);
    });

    it("should return 204 and update an account's password", async () => {
      expect.assertions(2);

      const account = {
        name: "jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send(account);
      const authorizationToken = jwtToken.sign({ email: account.email });
      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenRequest = {
        password: "newpa55",
      };

      const response = await api
        .patch("/accounts/")
        .set(givenAuthHeader)
        .send(givenRequest);

      const loginResponse = await api
        .post("/auth/login/")
        .send({ email: account.email, password: givenRequest.password });

      expect(response.statusCode).toBe(204);
      expect(loginResponse.statusCode).toBe(200);
    });

    it("should return 400 if email is already in use", async () => {
      expect.assertions(2);

      const account0 = {
        name: "jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      const account1 = { ...account0, email: "contato_jorge@email.com" };
      await api.post("/auth/register/").send(account0); // create two accounts
      await api.post("/auth/register/").send(account1);
      const authorizationToken = jwtToken.sign({ email: account0.email }); // authorize as account0
      const givenAuthHeader = { authorization: `Bearer ${authorizationToken}` };
      const givenRequest = {
        email: account1.email, // try to update account0's email to account1's email
      };

      const response = await api
        .patch("/accounts/")
        .set(givenAuthHeader)
        .send(givenRequest);

      expect(response.statusCode).toBe(400);
      const expectedBodyMessage = new EmailAlreadyInUseError(
        account1.email,
        defaultLanguage
      ).message;
      expect(response.body.error.message).toBe(expectedBodyMessage);
    });
  });
});
