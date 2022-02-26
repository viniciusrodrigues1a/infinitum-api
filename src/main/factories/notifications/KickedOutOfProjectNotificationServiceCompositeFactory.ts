import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import {
  NodemailerKickedOutOfProjectNotificationService,
  PushKickedOutOfProjectNotificationService,
} from "@modules/project/infra/notifications/KickedOutOfProject";
import { NotificationServiceComposite } from "@shared/infra/notifications";
import Queue from "@shared/infra/queue/Queue";
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

export function makeKickedOutOfProjectNotificationServiceComposite(): INotificationService {
  const email = new NodemailerKickedOutOfProjectNotificationService(
    Queue,
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository()
  );
  const push = new PushKickedOutOfProjectNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [email, push];
  return new NotificationServiceComposite(notificationServices);
}
