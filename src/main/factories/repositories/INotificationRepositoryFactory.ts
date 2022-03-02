import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IShouldAccountReceiveNotificationRepository,
} from "@shared/infra/notifications/interfaces";
import {
  IDoesNotificationBelongToAccountEmailRepository,
  IFindOneNotificationRepository,
  IMarkAllAsReadNotificationRepository,
  IMarkAsReadNotificationRepository,
} from "@shared/presentation/interfaces/repositories";

export interface INotificationRepositoryFactory {
  makeCreateNotificationRepository(): ICreateNotificationRepository;
  makeCreateNotificationSettingsRepository(): ICreateNotificationSettingsRepository;
  makeShouldAccountReceiveNotificationRepository(): IShouldAccountReceiveNotificationRepository;
  makeMarkAsReadNotificationRepository(): IMarkAsReadNotificationRepository;
  makeFindOneNotificationRepository(): IFindOneNotificationRepository;
  makeDoesNotificationBelongToAccountEmail(): IDoesNotificationBelongToAccountEmailRepository;
  makeMarkAllAsReadNotificationRepository(): IMarkAllAsReadNotificationRepository;
}
