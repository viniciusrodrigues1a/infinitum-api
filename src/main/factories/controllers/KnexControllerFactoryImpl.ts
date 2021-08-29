import { CreateAccountController } from "@modules/account/presentation/controllers";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IControllerFactory } from "./IControllerFactory";

class KnexControllerFactoryImpl implements IControllerFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeCreateAccountController(): CreateAccountController {
    return new CreateAccountController(
      this.repositoryFactory.makeRegisterAccountRepository(),
      this.repositoryFactory.makeDoesAccountExistRepository()
    );
  }
}

export const knexControllerFactoryImpl = new KnexControllerFactoryImpl();
