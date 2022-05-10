import { knexRepositoryFactoryImpl } from "@main/factories/repositories";
import { server } from "@main/server";

export async function loadProject(
  projectId: string,
  authorizedEmail: string | undefined
): Promise<void> {
  let users = server.getUsersListeningToProject(projectId);

  if (users.length === 0) return;

  const project = await knexRepositoryFactoryImpl
    .makeFindOneProjectRepository()
    .findOneProject(projectId);

  if (!project) {
    users.forEach((u) => {
      server.socketServer.to(u.socketId).emit("removeProject", projectId);
    });

    return;
  }

  if (authorizedEmail) {
    users = users.filter((u) => u.email !== authorizedEmail);
  }

  users.forEach((u) => {
    server.socketServer.to(u.socketId).emit("loadProject", project);
  });
}
