import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  notFoundResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IFindAccountImageDataURLRepository } from "../interfaces/repositories";

type FindOneAccountControllerRequest = {
  email: string;
};

export class FindOneAccountController implements IController {
  constructor(
    private readonly findOneAccountUseCase: FindOneAccountUseCase,
    private readonly findAccountImageDataURLRepository: IFindAccountImageDataURLRepository
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

      return okResponse({
        name: account.name,
        email: account.email,
        image: imageDataURL,
      });
    } catch (err) {
      if (err instanceof AccountNotFoundError) return notFoundResponse(err);

      return serverErrorResponse(err);
    }
  }
}
