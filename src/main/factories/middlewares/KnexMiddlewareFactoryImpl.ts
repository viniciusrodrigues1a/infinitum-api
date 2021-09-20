import { ILanguage } from "@shared/presentation/languages/ILanguage";
import { IAuthorizationMiddlewareLanguage } from "../../languages";
import { AuthorizationMiddleware, LanguageMiddleware } from "../../middlewares";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IMiddlewareFactory } from "./IMiddlewareFactory";

class KnexMiddlewareFactoryImpl implements IMiddlewareFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeAuthorizationMiddleware(
    language: IAuthorizationMiddlewareLanguage & ILanguage
  ): AuthorizationMiddleware {
    return new AuthorizationMiddleware(
      this.repositoryFactory.makeDoesAccountExistRepository(),
      language
    );
  }

  makeLanguageMiddleware(): LanguageMiddleware {
    return new LanguageMiddleware();
  }
}

export const knexMiddlewareFactoryImpl = new KnexMiddlewareFactoryImpl();
