import { NotificationSettings } from "@shared/infra/mongodb/models";

export interface ICreateNotificationSettingsRepository {
  createNotificationSettings(
    notificationSettings: NotificationSettings
  ): Promise<void>;
}
