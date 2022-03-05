import { mongoDBNotificationRepositoryFactoryImpl } from "@main/factories/repositories";
import { server } from "@main/server";

export async function loadNotifications(email: string): Promise<void> {
  const user = server.getUser(email);

  if (!user) return;

  const notifications = await mongoDBNotificationRepositoryFactoryImpl
    .makeFindAllNotificationsRepository()
    .findAllNotifications(email);

  server.socketServer
    .to(user.socketId)
    .emit("loadNotifications", notifications);
}

