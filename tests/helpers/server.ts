import { jwtToken } from "@modules/account/infra/authentication";
import supertest from "supertest";
import { ExpressServer } from "../../src/main/server";

jwtToken._config.signOptions.algorithm = "HS256";
jwtToken._config.privateKey = "secret-key";
jwtToken._config.publicKey = "secret-key";

const server = new ExpressServer();
export const api = supertest(server.app);
