import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import {
  NodemailerRoleUpdatedAdminNotificationService,
  PushRoleUpdatedAdminNotificationService,
} from "@modules/project/infra/notifications/RoleUpdatedAdmin";
import { NotificationServiceComposite } from "@shared/infra/notifications";
import Queue from "@shared/infra/queue/Queue";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
  INotificationRepositoryFactory,
  mongoDBNotificationRepositoryFactoryImpl,
} from "../repositories";

const repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;
const notificationRepositoryFactory: INotificationRepositoryFactory =
  mongoDBNotificationRepositoryFactoryImpl;

export function makeRoleUpdatedAdminNotificationServiceComposite(): INotificationService {
  const email = new NodemailerRoleUpdatedAdminNotificationService(
    Queue,
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository()
  );
  const push = new PushRoleUpdatedAdminNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [push, email];
  return new NotificationServiceComposite(notificationServices);
}
