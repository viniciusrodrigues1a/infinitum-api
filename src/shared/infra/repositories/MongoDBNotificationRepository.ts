import { ObjectId } from "mongodb";
import {
  IDoesNotificationBelongToAccountEmailRepository,
  IFindOneNotificationRepository,
  IFindOneNotificationSettingsRepository,
  IMarkAllAsReadNotificationRepository,
  IMarkAsReadNotificationRepository,
  IUpdateNotificationSettingsRepository,
} from "@shared/presentation/interfaces/repositories";
import {
  NotificationSettingsDTO,
  UpdateNotificationSettingsRepositoryDTO,
} from "@shared/presentation/interfaces/DTOs";
import { connection } from "../database/connection";
import { mongoHelper } from "../mongodb/connection";
import { Notification, NotificationSettings } from "../mongodb/models";
import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IFindAllNotificationsRepository,
  IShouldAccountReceiveNotificationRepository,
} from "../notifications/interfaces";

export class MongoDBNotificationRepository
  implements
    ICreateNotificationRepository,
    ICreateNotificationSettingsRepository,
    IShouldAccountReceiveNotificationRepository,
    IMarkAsReadNotificationRepository,
    IFindOneNotificationRepository,
    IDoesNotificationBelongToAccountEmailRepository,
    IMarkAllAsReadNotificationRepository,
    IFindAllNotificationsRepository,
    IUpdateNotificationSettingsRepository,
    IFindOneNotificationSettingsRepository
{
  async findOneNotificationsSetting(
    email: string
  ): Promise<NotificationSettingsDTO | undefined> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();
    if (!account) return undefined;

    const notificationSettings = await mongoHelper
      .getCollection("notificationSettings")
      .findOne({ user_id: account.id });

    return notificationSettings as unknown as NotificationSettingsDTO;
  }

  async updateNotificationSettings({
    settings,
    email,
  }: UpdateNotificationSettingsRepositoryDTO): Promise<void> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();
    if (!account) return;

    await mongoHelper
      .getCollection("notificationSettings")
      .updateOne(
        { user_id: account.id },
        {
          $set: {
            invitation: settings.invitation,
            kicked: settings.kicked,
            roleUpdated: settings.roleUpdated,
          },
        }
      );
  }

  async findAllNotifications(email: string): Promise<Notification[]> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();
    if (!account) return [];

    const notifications = await mongoHelper
      .getCollection("notifications")
      .find({ user_id: account.id })
      .sort({ createdAt: -1 })
      .toArray();

    return notifications as unknown as Notification[];
  }

  async markAllAsRead(email: string): Promise<void> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();
    if (!account) return;

    await mongoHelper
      .getCollection("notifications")
      .updateMany({ user_id: account.id }, { $set: { read: true } });
  }

  async doesNotificationBelongToAccountEmail(
    notificationId: string,
    email: string
  ): Promise<boolean> {
    const notification = await this.findOneNotification(notificationId);
    if (!notification) return false;

    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();
    if (!account) return false;

    return notification.user_id === account.id;
  }

  async findOneNotification(
    notificationId: string
  ): Promise<Notification | undefined> {
    const id = new ObjectId(notificationId);

    const notification = await mongoHelper
      .getCollection("notifications")
      .findOne({ _id: id });

    if (!notification) return undefined;
    return notification as unknown as Notification;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const id = new ObjectId(notificationId);

    await mongoHelper
      .getCollection("notifications")
      .updateOne({ _id: id }, { $set: { read: true } });
  }

  async shouldAccountReceiveNotification(
    email: string,
    notificationKey: string,
    notificationMethod: string
  ): Promise<boolean> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();

    if (!account) return false;

    const settings = await mongoHelper
      .getCollection("notificationSettings")
      .findOne({ user_id: account.id });

    if (!settings) return false;

    if (
      notificationKey in settings &&
      notificationMethod in settings[notificationKey]
    ) {
      return settings[notificationKey][notificationMethod];
    }

    return false;
  }

  async createNotificationSettings(
    notificationSettings: NotificationSettings
  ): Promise<void> {
    mongoHelper
      .getCollection("notificationSettings")
      .insertOne(notificationSettings);
  }

  async createNotification(notification: Notification): Promise<string> {
    const n = notification;
    if (!n.createdAt) n.createdAt = new Date().getTime();
    if (!n.read) n.read = false;

    const insertedNotification = await mongoHelper
      .getCollection("notifications")
      .insertOne(n);

    return insertedNotification.insertedId.toString();
  }
}
