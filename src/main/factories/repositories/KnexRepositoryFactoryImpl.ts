import {
  IRegisterAccountRepository,
  KnexRegisterAccountRepository,
} from "@modules/account/infra/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeRegisterAccountRepository(): IRegisterAccountRepository {
    return new KnexRegisterAccountRepository();
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
