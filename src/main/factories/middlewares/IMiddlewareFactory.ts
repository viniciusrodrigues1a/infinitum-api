import { AuthorizationMiddleware, LanguageMiddleware } from "@main/middlewares";
import { IAuthorizationMiddlewareLanguage } from "@main/languages";
import { ILanguage } from "@shared/presentation/languages/ILanguage";

export interface IMiddlewareFactory {
  makeAuthorizationMiddleware(
    language: IAuthorizationMiddlewareLanguage & ILanguage
  ): AuthorizationMiddleware;
  makeLanguageMiddleware(): LanguageMiddleware;
}
