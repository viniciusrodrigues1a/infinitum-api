import { CreateAccountController } from "@modules/account/presentation/controllers";
import { ILanguage } from "../../adapters/utils";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeCreateAccountController(language: ILanguage): CreateAccountController {
    return new CreateAccountController(
      this.repositoryFactory.makeRegisterAccountRepository(),
      this.repositoryFactory.makeDoesAccountExistRepository(),
      language
    );
  }
}

export const knexControllerFactoryImpl = new KnexControllerFactoryImpl();
