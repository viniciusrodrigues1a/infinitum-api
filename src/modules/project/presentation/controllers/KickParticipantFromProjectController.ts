import { KickParticipantFromProjectUseCase } from "@modules/project/use-cases";
import { KickParticipantFromProjectUseCaseDTO } from "@modules/project/use-cases/DTOs";
import {
  CannotKickOwnerOfProjectError,
  CannotKickYourselfError,
} from "@modules/project/use-cases/errors";
import { IFindAccountLanguageIsoCodeRepository } from "@shared/infra/notifications/interfaces";
import {
  badRequestResponse,
  noContentResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { INotificationService } from "@shared/presentation/interfaces/notifications";
import { IValidation } from "@shared/presentation/validation";
import {
  NotParticipantInProjectError,
  ProjectNotFoundError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";
import { IFindAllEmailsOfOwnersAndAdminsOfProjectRepository } from "../interfaces/repositories";

type KickParticipantFromProjectControllerRequest =
  KickParticipantFromProjectUseCaseDTO & {
    languages: any;
  };

export class KickParticipantFromProjectController implements IController {
  constructor(
    private readonly kickParticipantFromProjectUseCase: KickParticipantFromProjectUseCase,
    private readonly findAllEmailsOfOwnersAndAdminsOfProjectRepository: IFindAllEmailsOfOwnersAndAdminsOfProjectRepository,
    private readonly validation: IValidation,
    private readonly notifyUserNotificationService: INotificationService,
    private readonly notifyAdminsNotificationService: INotificationService,
    private readonly findAccountIsoCodeRepository: IFindAccountLanguageIsoCodeRepository
  ) {}

  async handleRequest(
    request: KickParticipantFromProjectControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.kickParticipantFromProjectUseCase.kick(request);

      const emailsOfOwnersAndAdmins =
        await this.findAllEmailsOfOwnersAndAdminsOfProjectRepository.findAllEmailsOfOwnersAndAdmins(
          request.projectId
        );
      const filteredEmails = emailsOfOwnersAndAdmins.filter(
        (e) =>
          e !== request.accountEmailMakingRequest && e !== request.accountEmail
      );

      filteredEmails.forEach(async (e: string) => {
        const isoCode = await this.findAccountIsoCodeRepository.findIsoCode(
          request.accountEmail
        );
        const lang = request.languages[isoCode];
        await this.notifyAdminsNotificationService.notify(e, {
          projectId: request.projectId,
          emailKicked: request.accountEmail,
          kickedAdminTemplateLanguage: lang,
        });
      });

      const isoCode = await this.findAccountIsoCodeRepository.findIsoCode(
        request.accountEmail
      );
      const lang = request.languages[isoCode];
      await this.notifyUserNotificationService.notify(request.accountEmail, {
        projectId: request.projectId,
        kickedTemplateLanguage: lang,
      });

      return noContentResponse();
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        return notFoundResponse(err);
      }

      if (
        err instanceof NotParticipantInProjectError ||
        err instanceof CannotKickOwnerOfProjectError ||
        err instanceof CannotKickYourselfError
      ) {
        return badRequestResponse(err);
      }

      if (err instanceof RoleInsufficientPermissionError) {
        return unauthorizedResponse(err);
      }

      return serverErrorResponse(err);
    }
  }
}
