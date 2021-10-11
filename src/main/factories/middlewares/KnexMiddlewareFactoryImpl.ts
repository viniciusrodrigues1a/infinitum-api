import { AuthorizationMiddleware, LanguageMiddleware } from "@main/middlewares";
import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
} from "@main/factories/repositories";
import { IMiddlewareFactory } from "./IMiddlewareFactory";

class KnexMiddlewareFactoryImpl implements IMiddlewareFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeAuthorizationMiddleware(): AuthorizationMiddleware {
    return new AuthorizationMiddleware(
      this.repositoryFactory.makeDoesAccountExistRepository()
    );
  }

  makeLanguageMiddleware(): LanguageMiddleware {
    return new LanguageMiddleware();
  }
}

export const knexMiddlewareFactoryImpl = new KnexMiddlewareFactoryImpl();
