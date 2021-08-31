import { CreateAccountController } from "@modules/account/presentation/controllers";
import { ILanguage } from "@modules/account/presentation/languages/ILanguage";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeCreateAccountController(language: ILanguage): CreateAccountController {
    return new CreateAccountController(
      this.repositoryFactory.makeRegisterAccountRepository(language),
      this.repositoryFactory.makeDoesAccountExistRepository(language),
      language
    );
  }
}

export const knexControllerFactoryImpl = new KnexControllerFactoryImpl();
