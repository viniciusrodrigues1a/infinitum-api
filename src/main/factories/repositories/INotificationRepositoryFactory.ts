import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
  IShouldAccountReceiveNotificationRepository,
} from "@shared/infra/notifications/interfaces";

export interface INotificationRepositoryFactory {
  makeCreateNotificationRepository(): ICreateNotificationRepository;
  makeCreateNotificationSettingsRepository(): ICreateNotificationSettingsRepository;
  makeShouldAccountReceiveNotificationRepository(): IShouldAccountReceiveNotificationRepository;
  makeMarkAsReadNotificationRepository(): IMarkAsReadNotificationRepository;
  makeFindOneNotificationRepository(): IFindOneNotificationRepository;
}
