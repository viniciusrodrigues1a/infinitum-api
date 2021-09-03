import {
  ILoginRepository,
  KnexDoesAccountExistRepository,
  KnexFindOneAccountRepository,
  KnexLoginRepository,
} from "@modules/account/infra/repositories";
import {
  IRegisterRepository,
  KnexRegisterRepository,
} from "@modules/account/infra/repositories/KnexRegisterRepository";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeFindOneaccountRepository(): IFindOneAccountRepository {
    return new KnexFindOneAccountRepository();
  }

  makeLoginRepository(language: IAccountLanguage): ILoginRepository {
    return new KnexLoginRepository(
      this.makeFindOneaccountRepository(),
      language,
      language
    );
  }

  makeDoesAccountExistRepository(): IDoesAccountExistRepository {
    return new KnexDoesAccountExistRepository();
  }

  makeRegisterRepository(language: IAccountLanguage): IRegisterRepository {
    return new KnexRegisterRepository(
      this.makeDoesAccountExistRepository(),
      language,
      language
    );
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
