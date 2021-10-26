import dotenv from "dotenv";
import { Server } from "http";
import express from "express";
import cors from "cors";
import {
  accountsRoutes,
  authRoutes,
  issueGroupsRoutes,
  issuesRoutes,
  projectsRoutes,
} from "@main/routes";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

dotenv.config();

export class ExpressServer {
  app = express();
  server: Server | null = null;

  constructor() {
    this.useMiddlewares();
    this.useRoutes();
  }

  private useMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      knexMiddlewareFactoryImpl.makeLanguageMiddleware().handleRequest
    );
  }

  private useRoutes() {
    this.app.use("/auth", authRoutes);
    this.app.use("/accounts", accountsRoutes);
    this.app.use("/projects", projectsRoutes);
    this.app.use("/issueGroups", issueGroupsRoutes);
    this.app.use("/issues", issuesRoutes);
  }

  public start(): void {
    const port = process.env.PORT;
    this.server = this.app.listen(port, () =>
      /* eslint-disable-next-line no-console  */
      console.log(`Server running on port ${port}`)
    );
  }

  public close(): void {
    if (!this.server) {
      throw new Error("Can't close server because it is not running");
    }
    this.server.close();
  }
}
