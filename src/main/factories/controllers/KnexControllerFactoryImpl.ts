import { LoginController } from "@modules/account/presentation/controllers/LoginController";
import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeLoginController(language: IAccountLanguage): LoginController {
    return new LoginController(
      this.repositoryFactory.makeLoginRepository(language)
    );
  }

  makeRegisterController(language: IAccountLanguage): RegisterController {
    return new RegisterController(
      this.repositoryFactory.makeRegisterRepository(language)
    );
  }
}

export const knexControllerFactoryImpl = new KnexControllerFactoryImpl();
