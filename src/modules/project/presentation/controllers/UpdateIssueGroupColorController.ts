import {
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IUpdateIssueGroupColorRepository } from "../interfaces/repositories";

type UpdateIssueGroupColorControllerRequest = {
  issueGroupId: string;
  newColor: string;
};

export class UpdateIssueGroupColorController implements IController {
  constructor(
    private readonly updateIssueGroupColorRepository: IUpdateIssueGroupColorRepository
  ) {}

  async handleRequest(
    request: UpdateIssueGroupColorControllerRequest
  ): Promise<HttpResponse> {
    try {
      await this.updateIssueGroupColorRepository.updateIssueGroupColor(request);

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
