import {
  IFindOneAccountIdByEmailRepository,
  IFindOneNotificationRepository,
  IMarkAsReadNotificationRepository,
} from "@shared/infra/notifications/interfaces";
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

type MarkNotificationAsReadControllerRequest = AccountMakingRequestDTO & {
  notificationId: string;
};

export class MarkNotificationAsReadController implements IController {
  constructor(
    private readonly markAsReadNotificationRepository: IMarkAsReadNotificationRepository,
    private readonly findOneNotificationRepository: IFindOneNotificationRepository,
    private readonly findOneAccountIdByEmailRepository: IFindOneAccountIdByEmailRepository,
    private readonly notificationNotFoundErrorLanguage: INotificationNotFoundErrorLanguage,
    private readonly notificationDoesntBelongToYouErrorLanguage: INotificationDoesntBelongToYouErrorLanguage
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
    notificationId,
  }: MarkNotificationAsReadControllerRequest): Promise<HttpResponse> {
    try {
      const accountId =
        await this.findOneAccountIdByEmailRepository.findOneAccountIdByEmail(
          accountEmailMakingRequest
        );

      const notification =
        await this.findOneNotificationRepository.findOneNotification(
          notificationId
        );
      if (!notification)
        return notFoundResponse(
          new NotificationNotFoundError(this.notificationNotFoundErrorLanguage)
        );

      if (notification.user_id !== accountId) {
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
