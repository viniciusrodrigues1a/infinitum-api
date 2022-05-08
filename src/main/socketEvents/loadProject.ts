import { knexRepositoryFactoryImpl } from "@main/factories/repositories";
import { server } from "@main/server";

export async function loadProject(projectId: string): Promise<void> {
  const users = server.getUsersListeningToProject(projectId);

  if (users.length === 0) return;

  const projects = await knexRepositoryFactoryImpl
    .makeListProjectsOwnedByAccountRepository()
    .listProjects(users[0].email);

  const project = projects.find((p) => p.projectId === projectId);

  if (!project) return;

  users.forEach((u) => {
    server.socketServer.to(u.socketId).emit("loadProject", project);
  });
}
