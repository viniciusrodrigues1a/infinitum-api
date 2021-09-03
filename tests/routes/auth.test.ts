import { connection, configuration } from "@shared/infra/database/connection";
import { api } from "../helpers";

describe("account registering endpoint", () => {
  beforeEach(async () => {
    await connection.migrate.latest(configuration.migrations);
  });

  afterEach(async () => {
    await connection.migrate.rollback(configuration.migrations);
  });

  afterAll(async () => {
    await connection.destroy();
  });

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
    expect.assertions(1);

    const body = {
      name: "Jorge",
      email: "notanemail",
      password: "jorgepa55",
    };

    const response = await api.post("/auth/register/").send(body);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if email is in use", async () => {
    expect.assertions(1);

    const body = {
      name: "Jorge",
      email: "notanemail",
      password: "jorgepa55",
    };
    await api.post("/accounts/").send(body);

    const response = await api.post("/auth/register/").send(body);

    expect(response.statusCode).toBe(400);
  });
});
