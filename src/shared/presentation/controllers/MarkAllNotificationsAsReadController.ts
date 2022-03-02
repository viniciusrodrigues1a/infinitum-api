import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { noContentResponse, serverErrorResponse } from "../http/httpHelper";
import { HttpResponse } from "../http/HttpResponse";
import { IController } from "../interfaces/controllers";
import { IMarkAllAsReadNotificationRepository } from "../interfaces/repositories";

type MarkAllNotificationsAsReadControllerRequest = AccountMakingRequestDTO;

export class MarkAllNotificationsAsReadController implements IController {
  constructor(
    private readonly markAllAsReadNotificationRepository: IMarkAllAsReadNotificationRepository
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
  }: MarkAllNotificationsAsReadControllerRequest): Promise<HttpResponse> {
    try {
      await this.markAllAsReadNotificationRepository.markAllAsRead(
        accountEmailMakingRequest
      );

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
