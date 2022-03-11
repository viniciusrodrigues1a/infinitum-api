import dotenv from "dotenv";
import { Server as HTTPServer, createServer } from "http";
import { Server as SocketServer } from "socket.io";
import express from "express";
import cors from "cors";
import {
  accountsRoutes,
  authRoutes,
  invitationsRoutes,
  issueGroupsRoutes,
  issuesRoutes,
  languagesRoutes,
  notificationSettingsRoutes,
  notificationsRoutes,
  projectsRoutes,
} from "@main/routes";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import { mongoDBNotificationRepositoryFactoryImpl } from "./factories/repositories";

dotenv.config();

type ConnectedUser = {
  email: string;
  socketId: string;
};

export class Server {
  app = express();
  httpServer: HTTPServer = createServer(this.app);
  socketServer: SocketServer = new SocketServer(this.httpServer, {
    cors: {
      origin: "*",
    },
  });
  connectedUsers: ConnectedUser[] = [];

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
    this.app.use("/invitations", invitationsRoutes);
    this.app.use("/languages", languagesRoutes);
    this.app.use("/notifications", notificationsRoutes);
    this.app.use("/notificationSettings", notificationSettingsRoutes);
  }

  public start(): void {
    this.startExpressServer();
    this.startSocketServer();
  }

  private startExpressServer(): void {
    const port = process.env.PORT;
    this.httpServer.listen(port, () =>
      /* eslint-disable-next-line no-console  */
      console.log(`Server running on port ${port}`)
    );
  }

  private startSocketServer(): void {
    this.socketServer.on("connection", (socket) => {
      socket.on("newUser", async (email) => {
        this.addNewUser(email, socket.id);

        const notifications = await mongoDBNotificationRepositoryFactoryImpl
          .makeFindAllNotificationsRepository()
          .findAllNotifications(email);

        socket.emit("loadNotifications", notifications);
      });

      socket.on("disconnect", () => {
        this.removeUser(socket.id);
      });
    });
  }

  private addNewUser(email: string, socketId: string): void {
    if (this.getUser(email)) return;
    this.connectedUsers.push({ email, socketId });
  }

  private removeUser(socketId: string): void {
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u.socketId !== socketId
    );
  }

  public getUser(email: string): ConnectedUser | undefined {
    return this.connectedUsers.find((u) => u.email === email);
  }

  public close(): void {
    this.socketServer.close();
    this.httpServer.close();
  }
}

export const server = new Server();
