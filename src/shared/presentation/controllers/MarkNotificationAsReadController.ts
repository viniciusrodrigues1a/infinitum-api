import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { NotificationNotFoundError } from "../errors";
import { NotificationDoesntBelongToYouError } from "../errors/NotificationDoesntBelongToYou";
import {
  noContentResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "../http/httpHelper";
import { HttpResponse } from "../http/HttpResponse";
import { IController } from "../interfaces/controllers";
import { INotificationNotFoundErrorLanguage } from "../interfaces/languages";
import { INotificationDoesntBelongToYouErrorLanguage } from "../interfaces/languages/INotificationDoesntBelongToYouErrorLanguage";
import {
  IDoesNotificationBelongToAccountEmailRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
} from "../interfaces/repositories";

type MarkNotificationAsReadControllerRequest = AccountMakingRequestDTO & {
  notificationId: string;
};

export class MarkNotificationAsReadController implements IController {
  constructor(
    private readonly markAsReadNotificationRepository: IMarkAsReadNotificationRepository,
    private readonly findOneNotificationRepository: IFindOneNotificationRepository,
    private readonly doesNotificationBelongToAccountEmailRepository: IDoesNotificationBelongToAccountEmailRepository,
    private readonly notificationNotFoundErrorLanguage: INotificationNotFoundErrorLanguage,
    private readonly notificationDoesntBelongToYouErrorLanguage: INotificationDoesntBelongToYouErrorLanguage
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
    notificationId,
  }: MarkNotificationAsReadControllerRequest): Promise<HttpResponse> {
    try {
      const notification =
        await this.findOneNotificationRepository.findOneNotification(
          notificationId
        );
      if (!notification)
        return notFoundResponse(
          new NotificationNotFoundError(this.notificationNotFoundErrorLanguage)
        );

      const doesNotificationBelongToAccount =
        await this.doesNotificationBelongToAccountEmailRepository.doesNotificationBelongToAccountEmail(
          notificationId,
          accountEmailMakingRequest
        );
      if (!doesNotificationBelongToAccount) {
        return unauthorizedResponse(
          new NotificationDoesntBelongToYouError(
            this.notificationDoesntBelongToYouErrorLanguage
          )
        );
      }

      await this.markAsReadNotificationRepository.markAsRead(notificationId);

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
