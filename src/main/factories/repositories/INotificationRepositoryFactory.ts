import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IFindAllNotificationsRepository,
  IShouldAccountReceiveNotificationRepository,
} from "@shared/infra/notifications/interfaces";
import {
  IDoesNotificationBelongToAccountEmailRepository,
  IFindOneNotificationRepository,
  IMarkAllAsReadNotificationRepository,
  IMarkAsReadNotificationRepository,
  IUpdateNotificationSettingsRepository,
} from "@shared/presentation/interfaces/repositories";

export interface INotificationRepositoryFactory {
  makeCreateNotificationRepository(): ICreateNotificationRepository;
  makeCreateNotificationSettingsRepository(): ICreateNotificationSettingsRepository;
  makeShouldAccountReceiveNotificationRepository(): IShouldAccountReceiveNotificationRepository;
  makeMarkAsReadNotificationRepository(): IMarkAsReadNotificationRepository;
  makeFindOneNotificationRepository(): IFindOneNotificationRepository;
  makeDoesNotificationBelongToAccountEmail(): IDoesNotificationBelongToAccountEmailRepository;
  makeMarkAllAsReadNotificationRepository(): IMarkAllAsReadNotificationRepository;
  makeFindAllNotificationsRepository(): IFindAllNotificationsRepository;
  makeUpdateNotificationSettingsRepository(): IUpdateNotificationSettingsRepository;
}
