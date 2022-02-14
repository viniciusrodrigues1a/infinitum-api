import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IFindProjectImageDataURLRepository } from "../interfaces/repositories";

export type FindProjectImageDataURLControllerRequest = {
  projectId: string;
};

export class FindProjectImageDataURLController implements IController {
  constructor(
    private readonly findProjectImageDataURLRepository: IFindProjectImageDataURLRepository
  ) {}

  async handleRequest({
    projectId,
  }: FindProjectImageDataURLControllerRequest): Promise<HttpResponse> {
    try {
      const dataURL =
        await this.findProjectImageDataURLRepository.findProjectImageDataURL(
          projectId
        );

      if (!dataURL)
        return notFoundResponse(new Error("Image could not be found."));

      return okResponse({ dataURL });
    } catch (err) {
      return serverErrorResponse(err);
    }
  }

  private static findMimeType(base64: string) {
    if (base64.startsWith("iVBOR")) return "image/png";
    if (base64.startsWith("PHN2")) return "image/svg+xml";
    if (base64.startsWith("/9j/")) return "image/jpeg";

    return "image/*";
  }
}
