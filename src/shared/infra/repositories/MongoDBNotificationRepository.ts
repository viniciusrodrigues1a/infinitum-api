import { ObjectId } from "mongodb";
import { connection } from "../database/connection";
import { mongoHelper } from "../mongodb/connection";
import { Notification, NotificationSettings } from "../mongodb/models";
import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
  IShouldAccountReceiveNotificationRepository,
} from "../notifications/interfaces";

export class MongoDBNotificationRepository
  implements
    ICreateNotificationRepository,
    ICreateNotificationSettingsRepository,
    IShouldAccountReceiveNotificationRepository,
    IMarkAsReadNotificationRepository,
    IFindOneNotificationRepository
{
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
    if (!n.read) {
      n.read = false;
    }

    const insertedNotification = await mongoHelper
      .getCollection("notifications")
      .insertOne(n);

    return insertedNotification.insertedId.toString();
  }
}
