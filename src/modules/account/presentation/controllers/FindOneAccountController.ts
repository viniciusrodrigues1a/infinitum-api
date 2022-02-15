import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import {
  IFindAccountImageDataURLRepository,
  IFindAccountLanguageIdRepository,
} from "../interfaces/repositories";

type FindOneAccountControllerRequest = {
  email: string;
};

export class FindOneAccountController implements IController {
  constructor(
    private readonly findOneAccountUseCase: FindOneAccountUseCase,
    private readonly findAccountImageDataURLRepository: IFindAccountImageDataURLRepository,
    private readonly findAccountLanguageIdRepository: IFindAccountLanguageIdRepository
  ) {}

  async handleRequest({
    email,
  }: FindOneAccountControllerRequest): Promise<HttpResponse> {
    try {
      const account = await this.findOneAccountUseCase.findOne(email);
      const imageDataURL =
        await this.findAccountImageDataURLRepository.findAccountImageDataURL(
          email
        );
      const languageId =
        await this.findAccountLanguageIdRepository.findAccountLanguage(email);

      return okResponse({
        name: account.name,
        email: account.email,
        languageId,
        image: imageDataURL,
      });
    } catch (err) {
      if (err instanceof AccountNotFoundError) return notFoundResponse(err);

      return serverErrorResponse(err);
    }
  }
}
