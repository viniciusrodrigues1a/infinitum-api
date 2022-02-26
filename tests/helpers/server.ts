import supertest from "supertest";

import { server } from "@main/server";
import { jwtToken } from "@modules/account/infra/authentication";
import { mongoHelper } from "@shared/infra/mongodb/connection";
import { mongoMock } from "./mongoMock";

jwtToken._config.signOptions.algorithm = "HS256";
jwtToken._config.privateKey = "secret-key";
jwtToken._config.publicKey = "secret-key";

mongoHelper.client = mongoMock;
export const api = supertest(server.app);
