import { FindOneAccountController } from "@modules/account/presentation/controllers/FindOneAccountController";
import { LoginController } from "@modules/account/presentation/controllers/LoginController";
import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IUseCaseFactory, knexUseCaseFactoryImpl } from "../use-cases";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;
  private useCaseFactory: IUseCaseFactory = knexUseCaseFactoryImpl;

  makeFindOneAccountController(
    language: IAccountLanguage
  ): FindOneAccountController {
    return new FindOneAccountController(
      this.useCaseFactory.makeFindOneAccountUseCase(language)
    );
  }

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
