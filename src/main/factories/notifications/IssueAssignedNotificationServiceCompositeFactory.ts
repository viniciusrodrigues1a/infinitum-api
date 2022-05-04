import { SocketIOSocketServerEmitterAdapter } from "@main/adapters";
import { server } from "@main/server";
import {
  NodemailerIssueAssignedNotificationService,
  PushIssueAssignedToAnAccountNotificationService,
} from "@modules/issue/infra/notifications";
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

export function makeIssueAssignedNotificationServiceComposite(): INotificationService {
  const email = new NodemailerIssueAssignedNotificationService(
    Queue,
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindProjectIdByIssueIdRepository(),
    repositoryFactory.makeFindIssueTitleByProjectIdRepository()
  );
  const push = new PushIssueAssignedToAnAccountNotificationService(
    notificationRepositoryFactory.makeShouldAccountReceiveNotificationRepository(),
    repositoryFactory.makeFindOneAccountIdByEmailRepository(),
    repositoryFactory.makeFindIssueTitleByProjectIdRepository(),
    repositoryFactory.makeFindProjectIdByIssueIdRepository(),
    notificationRepositoryFactory.makeCreateNotificationRepository(),
    SocketIOSocketServerEmitterAdapter(server)
  );
  const notificationServices = [push, email];
  return new NotificationServiceComposite(notificationServices);
}
