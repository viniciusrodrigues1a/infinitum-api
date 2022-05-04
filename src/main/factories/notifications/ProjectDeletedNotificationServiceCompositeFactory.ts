import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import { NodemailerProjectDeletedNotificationService } from "@modules/project/infra/notifications/ProjectDeleted/NodemailerProjectDeletedNotificationService";
import { PushProjectDeletedNotificationService } from "@modules/project/infra/notifications/ProjectDeleted/PushProjectDeletedNotificationService";
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

export function makeProjectDeletedNotificationServiceComposite(): INotificationService {
  const email = new NodemailerProjectDeletedNotificationService(
    Queue,
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository()
  );
  const push = new PushProjectDeletedNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [email, push];
  return new NotificationServiceComposite(notificationServices);
}
