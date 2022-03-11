import { NotificationSettingsDTO } from "../DTOs";

export interface IFindOneNotificationSettingsRepository {
  findOneNotificationsSetting(
    email: string
  ): Promise<NotificationSettingsDTO | undefined>;
}
