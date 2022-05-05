import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import {
  NodemailerKickedOutOfProjectAdminNotificationService,
  PushKickedOutOfProjectAdminNotificationService,
} from "@modules/project/infra/notifications/KickedOutOfProjectAdmin";
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

export function makeKickedOutOfProjectAdminNotificationServiceComposite(): INotificationService {
  const email = new NodemailerKickedOutOfProjectAdminNotificationService(
    Queue,
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository()
  );
  const push = new PushKickedOutOfProjectAdminNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [email, push];
  return new NotificationServiceComposite(notificationServices);
}
