import {
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IUpdateIssueGroupFinalStatusRepository } from "../interfaces/repositories";

export type UpdateIssueGroupControllerRequest = {
  issueGroupId: string;
  newIsFinal: boolean;
};

export default class UpdateIssueGroupFinalStatusController
  implements IController
{
  constructor(
    private readonly updateIssueGroupFinalStatusRepository: IUpdateIssueGroupFinalStatusRepository
  ) {}

  async handleRequest({
    issueGroupId,
    newIsFinal,
  }: UpdateIssueGroupControllerRequest): Promise<HttpResponse> {
    try {
      await this.updateIssueGroupFinalStatusRepository.updateIssueGroupFinalStatus(
        {
          issueGroupId,
          newIsFinal,
        }
      );

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
