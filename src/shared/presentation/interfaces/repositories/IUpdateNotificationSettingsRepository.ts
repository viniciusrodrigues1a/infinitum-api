import { UpdateNotificationSettingsRepositoryDTO } from "../DTOs";

export interface IUpdateNotificationSettingsRepository {
  updateNotificationSettings(
    notificationSettings: UpdateNotificationSettingsRepositoryDTO
  ): Promise<void>;
}
