import {
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IUpdateProjectImageRepository } from "../interfaces/repositories";

export type UpdateProjectImageControllerRequest = {
  projectId: string;
  file: any;
};

export class UpdateProjectImageController implements IController {
  constructor(
    private readonly updateProjectImageRepository: IUpdateProjectImageRepository
  ) {}

  async handleRequest(
    request: UpdateProjectImageControllerRequest
  ): Promise<HttpResponse> {
    try {
      await this.updateProjectImageRepository.updateProjectImage(request);

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
