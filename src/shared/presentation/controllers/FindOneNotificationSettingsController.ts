import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { NotificationNotFoundError } from "../errors";
import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
} from "../http/httpHelper";
import { HttpResponse } from "../http/HttpResponse";
import { IController } from "../interfaces/controllers";
import { INotificationNotFoundErrorLanguage } from "../interfaces/languages";
import { IFindOneNotificationSettingsRepository } from "../interfaces/repositories";

export type FindOneNotificationSettingsControllerRequest =
  AccountMakingRequestDTO;

export class FindOneNotificationSettingsController implements IController {
  constructor(
    private readonly findOneNotificationsSettingRepository: IFindOneNotificationSettingsRepository,
    private readonly notificationNotFoundErrorLanguage: INotificationNotFoundErrorLanguage
  ) {}

  async handleRequest({
    accountEmailMakingRequest,
  }: FindOneNotificationSettingsControllerRequest): Promise<HttpResponse> {
    try {
      const notificationSettings =
        await this.findOneNotificationsSettingRepository.findOneNotificationsSetting(
          accountEmailMakingRequest
        );
      if (!notificationSettings)
        return notFoundResponse(
          new NotificationNotFoundError(this.notificationNotFoundErrorLanguage)
        );

      return okResponse(notificationSettings);
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}

