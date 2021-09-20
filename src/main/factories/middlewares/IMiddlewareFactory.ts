import { ILanguage } from "@shared/presentation/languages/ILanguage";
import { IAuthorizationMiddlewareLanguage } from "main/languages";
import { AuthorizationMiddleware, LanguageMiddleware } from "../../middlewares";

export interface IMiddlewareFactory {
  makeAuthorizationMiddleware(
    language: IAuthorizationMiddlewareLanguage & ILanguage
  ): AuthorizationMiddleware;
  makeLanguageMiddleware(): LanguageMiddleware;
}
