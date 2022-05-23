import {
  badRequestResponse,
  okResponse,
  serverErrorResponse,
} from "@shared/presentation/http/httpHelper";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { IValidation } from "@shared/presentation/validation";
import { IRefreshTokenRepository } from "../interfaces/repositories";

type RefreshTokenControllerRequest = {
  token: string;
};

export class RefreshTokenController implements IController {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly validation: IValidation
  ) {}

  async handleRequest(
    request: RefreshTokenControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request);
      if (validationError) {
        return badRequestResponse(validationError);
      }

      const tokens = await this.refreshTokenRepository.refreshToken(
        request.token
      );

      return okResponse(tokens);
    } catch (err) {
      return serverErrorResponse(err);
    }
  }
}
