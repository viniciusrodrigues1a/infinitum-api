import {
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IListLanguagesRepository } from "../interfaces/repositories";

export class ListLanguagesController implements IController {
  constructor(
    private readonly listLanguagesRepository: IListLanguagesRepository
  ) {}

  async handleRequest(): Promise<HttpResponse> {
    try {
      const languages = await this.listLanguagesRepository.listLanguages();

      return okResponse(languages);
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
