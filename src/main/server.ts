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
import {
  knexRepositoryFactoryImpl,
  mongoDBNotificationRepositoryFactoryImpl,
} from "./factories/repositories";

dotenv.config();

type ConnectedUser = {
  email: string;
  socketId: string;
};

type ProjectBeingListenedByUsers = {
  [projectId: string]: {
    emails: string[];
  };
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
  projectsBeingListenedByUsers: ProjectBeingListenedByUsers = {};

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

      socket.on("addUserToProjectListener", async ({ email, projectId }) => {
        this.addUserToProjectListener(email, projectId);

        const project = await knexRepositoryFactoryImpl
          .makeFindOneProjectRepository()
          .findOneProject(projectId);

        socket.emit("loadProject", project);
      });

      socket.on("removeUserFromProjectListener", ({ email, projectId }) => {
        this.removeUserFromProjectListener(email, projectId);
      });

      socket.on("disconnect", () => {
        this.removeUser(socket.id);
      });
    });
  }

  private isUserListeningToProject(email: string, projectId: string): boolean {
    if (projectId in this.projectsBeingListenedByUsers) {
      const emailFound = this.projectsBeingListenedByUsers[
        projectId
      ].emails.find((e) => e === email);
      return !!emailFound;
    }

    return false;
  }

  private addUserToProjectListener(email: string, projectId: string): void {
    if (this.isUserListeningToProject(email, projectId)) return;
    if (!(projectId in this.projectsBeingListenedByUsers)) {
      this.projectsBeingListenedByUsers[projectId] = { emails: [] };
    }
    this.projectsBeingListenedByUsers[projectId].emails.push(email);
  }

  private removeUserFromProjectListener(
    email: string,
    projectId: string
  ): void {
    if (!this.isUserListeningToProject(email, projectId)) return;
    if (!(projectId in this.projectsBeingListenedByUsers)) return;
    this.projectsBeingListenedByUsers[projectId].emails =
      this.projectsBeingListenedByUsers[projectId].emails.filter(
        (e) => e !== email
      );
  }

  public getUsersListeningToProject(projectId: string): ConnectedUser[] {
    if (!(projectId in this.projectsBeingListenedByUsers)) return [];

    const { emails } = this.projectsBeingListenedByUsers[projectId];

    const conns = emails.map((e) => this.getUser(e));

    return conns.filter((c) => c !== undefined) as ConnectedUser[];
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
