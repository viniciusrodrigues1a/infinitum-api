import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import {
  NodemailerInvitationToProjectNotificationService,
  PushInvitationToProjectNotificationService,
} from "@modules/project/infra/notifications/InvitationToProject";
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

export function makeInvitationToProjectNotificationServiceComposite(): INotificationService {
  const email = new NodemailerInvitationToProjectNotificationService(
    Queue,
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository()
  );
  const push = new PushInvitationToProjectNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    repositoryFactory.makeFindProjectNameByProjectIdRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [email, push];
  return new NotificationServiceComposite(notificationServices);
}
