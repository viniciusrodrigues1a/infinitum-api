import dotenv from "dotenv";
import { Server } from "http";
import "@shared/infra/database/connection";
import express from "express";
import { authRoutes } from "./routes";

dotenv.config();

export class ExpressServer {
  app = express();
  server: Server | null = null;

  constructor() {
    this.useMiddlewares();
    this.useRoutes();
  }

  private useMiddlewares() {
    this.app.use(express.json());
  }

  private useRoutes() {
    this.app.use("/auth", authRoutes);
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
