import {
  IRegisterAccountRepository,
  KnexDoesAccountExistRepository,
  KnexRegisterAccountRepository,
} from "@modules/account/infra/repositories";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeDoesAccountExistRepository(): IDoesAccountExistRepository {
    return new KnexDoesAccountExistRepository();
  }

  makeRegisterAccountRepository(
    language: IAccountLanguage
  ): IRegisterAccountRepository {
    return new KnexRegisterAccountRepository(
      this.makeDoesAccountExistRepository(),
      language,
      language
    );
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
