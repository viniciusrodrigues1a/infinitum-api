import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IFindProjectImageBufferRepository } from "../interfaces/repositories";

export type FindProjectImageDataURLControllerRequest = {
  projectId: string;
};

export class FindProjectImageDataURLController implements IController {
  constructor(
    private readonly findProjectImageBufferRepository: IFindProjectImageBufferRepository
  ) {}

  async handleRequest({
    projectId,
  }: FindProjectImageDataURLControllerRequest): Promise<HttpResponse> {
    try {
      const buffer =
        await this.findProjectImageBufferRepository.findProjectImageBuffer(
          projectId
        );

      if (!buffer)
        return notFoundResponse(new Error("Image could not be found."));

      const base64String = buffer!.toString("base64");

      const mimeType =
        FindProjectImageDataURLController.findMimeType(base64String);
      const dataURLPrefix = `data:${mimeType};base64,`;
      const dataURL = dataURLPrefix + base64String;

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
