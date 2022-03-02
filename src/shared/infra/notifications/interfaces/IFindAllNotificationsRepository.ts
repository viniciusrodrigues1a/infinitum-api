import { Notification } from "@shared/infra/mongodb/models";

export interface IFindAllNotificationsRepository {
  findAllNotifications(email: string): Promise<Notification[]>;
}
