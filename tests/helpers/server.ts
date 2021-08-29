import supertest from "supertest";
import { ExpressServer } from "../../src/main/server";

const server = new ExpressServer();
export const api = supertest(server.app);
