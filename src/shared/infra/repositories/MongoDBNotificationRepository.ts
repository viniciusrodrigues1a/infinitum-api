import { connection } from "../database/connection";
import { mongoHelper } from "../mongodb/connection";
import { Notification, NotificationSettings } from "../mongodb/models";
import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IShouldAccountReceiveNotificationRepository,
} from "../notifications/interfaces";

export class MongoDBNotificationRepository
  implements
    ICreateNotificationRepository,
    ICreateNotificationSettingsRepository,
    IShouldAccountReceiveNotificationRepository
{
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

  async createNotification(notification: Notification): Promise<void> {
    await mongoHelper.getCollection("notifications").insertOne(notification);
  }
}
