import { InvalidEmailError } from "@modules/account/entities/errors";
import { InvalidCredentialsError } from "@modules/account/infra/repositories/errors/InvalidCredentialsError";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { connection, configuration } from "@shared/infra/database/connection";
import { api, defaultLanguage } from "../helpers";

describe("/auth/ endpoint", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("account registering endpoint", () => {
    it("should return 204", async () => {
      expect.assertions(1);

      const body = {
        name: "Jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };

      const response = await api.post("/auth/register/").send(body);

      expect(response.statusCode).toBe(204);
    });

    it("should return 400 if email is invalid", async () => {
      expect.assertions(2);

      const body = {
        name: "Jorge",
        email: "notanemail",
        password: "jorgepa55",
      };

      const response = await api.post("/auth/register/").send(body);

      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe(
        new InvalidEmailError(defaultLanguage).message
      );
    });

    it("should return 400 if email is in use", async () => {
      expect.assertions(2);

      const body = {
        name: "Jorge",
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send(body);

      const response = await api.post("/auth/register/").send(body);

      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe(
        new EmailAlreadyInUseError(body.email, defaultLanguage).message
      );
    });
  });

  describe("login endpoint", () => {
    it("should return 200 and a token", async () => {
      expect.assertions(2);

      const body = {
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send({ name: "jorge", ...body });

      const response = await api.post("/auth/login/").send(body);

      expect(response.statusCode).toBe(200);
      expect(typeof response.body.token).toBe("string");
    });

    it("should return 400 if email is wrong", async () => {
      expect.assertions(2);

      const body = {
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send({ name: "jorge", ...body });

      const response = await api
        .post("/auth/login/")
        .send({ email: "wrong@email.com", password: body.password });

      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe(
        new InvalidCredentialsError(defaultLanguage).message
      );
    });

    it("should return 400 if password is wrong", async () => {
      expect.assertions(2);

      const body = {
        email: "jorge@email.com",
        password: "jorgepa55",
      };
      await api.post("/auth/register/").send({ name: "jorge", ...body });

      const response = await api
        .post("/auth/login/")
        .send({ email: body.email, password: "wrongpa55" });

      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe(
        new InvalidCredentialsError(defaultLanguage).message
      );
    });
  });
});
