import {
  noContentResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IUpdateProjectImageRepository } from "../interfaces/repositories";

export type UpdateProjectImageControllerRequest = {
  projectId: string;
  fileBuffer: Buffer;
};

export class UpdateProjectImageController implements IController {
  constructor(
    private readonly updateProjectImageRepository: IUpdateProjectImageRepository
  ) {}

  async handleRequest(
    request: UpdateProjectImageControllerRequest
  ): Promise<HttpResponse> {
    try {
      const twoMegabytes = 2000000;

      if (request.fileBuffer.length > twoMegabytes) {
        throw new Error("File is too big");
      }

      await this.updateProjectImageRepository.updateProjectImage(request);

      return noContentResponse();
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
