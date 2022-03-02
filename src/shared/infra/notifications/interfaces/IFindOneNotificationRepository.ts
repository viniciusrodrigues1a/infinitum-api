import { Notification } from "@shared/infra/mongodb/models";

export interface IFindOneNotificationRepository {
  findOneNotification(
    notificationId: string
  ): Promise<Notification | undefined>;
}
