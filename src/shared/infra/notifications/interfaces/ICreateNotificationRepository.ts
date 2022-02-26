import { Notification } from "@shared/infra/mongodb/models";

export interface ICreateNotificationRepository {
  createNotification(notification: Notification): Promise<void>;
}
