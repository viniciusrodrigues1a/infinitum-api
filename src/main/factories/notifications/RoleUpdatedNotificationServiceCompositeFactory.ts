import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import { PushRoleUpdatedNotificationService } from "@modules/project/infra/notifications/RoleUpdated";
import { NotificationServiceComposite } from "@shared/infra/notifications";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import {
  INotificationRepositoryFactory,
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
  mongoDBNotificationRepositoryFactoryImpl,
} from "../repositories";

const repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;
const notificationRepositoryFactory: INotificationRepositoryFactory =
  mongoDBNotificationRepositoryFactoryImpl;

export function makeRoleUpdatedNotificationServiceComposite(): INotificationService {
  const push = new PushRoleUpdatedNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [push];
  return new NotificationServiceComposite(notificationServices);
}
