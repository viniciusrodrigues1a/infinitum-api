import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import { noContentResponse, serverErrorResponse } from "../http/httpHelper";
import { HttpResponse } from "../http/HttpResponse";
import { IController } from "../interfaces/controllers";
import { NotificationSettingsDTO } from "../interfaces/DTOs";
import { IUpdateNotificationSettingsRepository } from "../interfaces/repositories";

export type UpdateNotificationSettingsControllerRequest =
  AccountMakingRequestDTO & { settings: NotificationSettingsDTO };

export class UpdateNotificationSettingsController implements IController {
  constructor(
    private readonly updateNotificationSettingsRepository: IUpdateNotificationSettingsRepository
  ) {}

  async handleRequest({
    settings,
    accountEmailMakingRequest,
  }: UpdateNotificationSettingsControllerRequest): Promise<HttpResponse> {
    try {
      await this.updateNotificationSettingsRepository.updateNotificationSettings(
        { settings, email: accountEmailMakingRequest }
      );

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
