import {
  ICreateNotificationRepository,
  ICreateNotificationSettingsRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
  IShouldAccountReceiveNotificationRepository,
} from "@shared/infra/notifications/interfaces";
import { MongoDBNotificationRepository } from "@shared/infra/repositories";
import { INotificationRepositoryFactory } from "./INotificationRepositoryFactory";

class MongoDBNotificationRepositoryFactoryImpl
  implements INotificationRepositoryFactory
{
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
