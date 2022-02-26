import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IShouldAccountReceiveNotificationRepository,
} from "@shared/infra/notifications/interfaces";

export interface INotificationRepositoryFactory {
  makeCreateNotificationRepository(): ICreateNotificationRepository;
  makeCreateNotificationSettingsRepository(): ICreateNotificationSettingsRepository;
  makeShouldAccountReceiveNotificationRepository(): IShouldAccountReceiveNotificationRepository;
}
