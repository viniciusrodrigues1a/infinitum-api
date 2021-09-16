import { configuration, connection } from "@shared/infra/database/connection";
import { api } from "../helpers";

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
});
