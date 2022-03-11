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
import { MongoDBNotificationRepository } from "@shared/infra/repositories";
import { INotificationRepositoryFactory } from "./INotificationRepositoryFactory";

class MongoDBNotificationRepositoryFactoryImpl
  implements INotificationRepositoryFactory
{
  makeUpdateNotificationSettingsRepository(): IUpdateNotificationSettingsRepository {
    return this.makeNotificationRepository();
  }

  makeFindAllNotificationsRepository(): IFindAllNotificationsRepository {
    return this.makeNotificationRepository();
  }

  makeMarkAllAsReadNotificationRepository(): IMarkAllAsReadNotificationRepository {
    return this.makeNotificationRepository();
  }

  makeDoesNotificationBelongToAccountEmail(): IDoesNotificationBelongToAccountEmailRepository {
    return this.makeNotificationRepository();
  }

  makeFindOneNotificationRepository(): IFindOneNotificationRepository {
    return this.makeNotificationRepository();
  }

  makeMarkAsReadNotificationRepository(): IMarkAsReadNotificationRepository {
    return this.makeNotificationRepository();
  }

  makeShouldAccountReceiveNotificationRepository(): IShouldAccountReceiveNotificationRepository {
    return this.makeNotificationRepository();
  }

  makeCreateNotificationSettingsRepository(): ICreateNotificationSettingsRepository {
    return this.makeNotificationRepository();
  }

  makeCreateNotificationRepository(): ICreateNotificationRepository {
    return this.makeNotificationRepository();
  }

  private makeNotificationRepository() {
    return new MongoDBNotificationRepository();
  }
}

export const mongoDBNotificationRepositoryFactoryImpl =
  new MongoDBNotificationRepositoryFactoryImpl();
