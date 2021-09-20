import { jwtToken } from "@modules/account/infra/authentication";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import {
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@shared/presentation/http/httpHelper";
import { ILanguage } from "@shared/presentation/languages/ILanguage";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";
import { NextFunction, Request, Response } from "express";
import { IAuthorizationMiddlewareLanguage } from "../languages";

export class AuthorizationMiddleware {
  constructor(
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly language: IAuthorizationMiddlewareLanguage & ILanguage
  ) {}

  async handleRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const language = request.language as IAuthorizationMiddlewareLanguage &
      ILanguage;
    const { authorization } = request.headers;

    if (!authorization) {
      const { statusCode, body } = badRequestResponse(
        new Error(language.getMissingAuthorizationHeaderMessage())
      );

      return response
        .status(statusCode)
        .json({ error: { message: body.message } });
    }

    const token = authorization.split(" ")[1];

    try {
      const { email } = await jwtToken.verify(token);

      const accountExists =
        await this.doesAccountExistRepository.doesAccountExist(email);
      if (!accountExists) {
        const { statusCode, body } = notFoundResponse(
          new AccountNotFoundError(email, language)
        );

        return response
          .status(statusCode)
          .json({ error: { message: body.message } });
      }

      request.authorizedAccountEmail = email;

      return next();
    } catch (err) {
      const { statusCode, body } = unauthorizedResponse(
        new Error(language.getUnauthorizedMessage())
      );

      return response
        .status(statusCode)
        .json({ error: { message: body.message } });
    }
  }
}
