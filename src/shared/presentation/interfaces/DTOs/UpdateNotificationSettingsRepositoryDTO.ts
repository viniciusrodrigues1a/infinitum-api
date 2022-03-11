import { NotificationSettingsDTO } from "./NotificationSettingsDTO";

export type UpdateNotificationSettingsRepositoryDTO = {
  settings: NotificationSettingsDTO;
  email: string;
};
