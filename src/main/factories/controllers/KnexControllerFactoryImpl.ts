import { CreateAccountController } from "@modules/account/presentation/controllers";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeCreateAccountController(
    language: IAccountLanguage
  ): CreateAccountController {
    return new CreateAccountController(
      this.repositoryFactory.makeRegisterAccountRepository(language)
    );
  }
}

export const knexControllerFactoryImpl = new KnexControllerFactoryImpl();
