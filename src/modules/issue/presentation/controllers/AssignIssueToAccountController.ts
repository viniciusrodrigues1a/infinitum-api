import { AssignIssueToAccountUseCase } from "@modules/issue/use-cases";
import { AssignIssueToAccountUseCaseDTO } from "@modules/issue/use-cases/DTOs";
import { IssueNotFoundError } from "@modules/issue/use-cases/errors";
import { IIssueAssignedToAnAccountTemplateLanguage } from "@modules/project/presentation/interfaces/languages";
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
  ProjectNotFoundError,
  NotParticipantInProjectError,
  RoleInsufficientPermissionError,
} from "@shared/use-cases/errors";

export type AssignIssueToAccountControllerRequest =
  AssignIssueToAccountUseCaseDTO;

export class AssignIssueToAccountController implements IController {
  constructor(
    private readonly assignIssueToAccountUseCase: AssignIssueToAccountUseCase,
    private readonly validation: IValidation,
    private readonly notificationService: INotificationService,
    private readonly issueAssignedTemplateLanguage: IIssueAssignedToAnAccountTemplateLanguage
  ) {}

  async handleRequest(
    request: AssignIssueToAccountControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      await this.assignIssueToAccountUseCase.assign(request);

      if (request.assignedToEmail) {
        await this.notificationService.notify(request.assignedToEmail, {
          issueId: request.issueId,
          issueAssignedTemplateLanguage: this.issueAssignedTemplateLanguage,
        });
      }

      return noContentResponse();
    } catch (err) {
      if (
        err instanceof ProjectNotFoundError ||
        err instanceof IssueNotFoundError
      ) {
        return notFoundResponse(err);
      }

      if (err instanceof NotParticipantInProjectError)
        return badRequestResponse(err);

      if (err instanceof RoleInsufficientPermissionError)
        return unauthorizedResponse(err);

      return serverErrorResponse(err);
    }
  }
}
