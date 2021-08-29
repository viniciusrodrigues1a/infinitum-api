import {
  IRegisterAccountRepository,
  KnexDoesAccountExistRepository,
  KnexRegisterAccountRepository,
} from "@modules/account/infra/repositories";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeDoesAccountExistRepository(): IDoesAccountExistRepository {
    return new KnexDoesAccountExistRepository();
  }

  makeRegisterAccountRepository(): IRegisterAccountRepository {
    return new KnexRegisterAccountRepository();
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
