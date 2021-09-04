import {
  KnexDoesAccountExistRepository,
  KnexFindOneAccountRepository,
  KnexLoginRepository,
} from "@modules/account/infra/repositories";
import { KnexRegisterRepository } from "@modules/account/infra/repositories/KnexRegisterRepository";
import {
  ILoginRepository,
  IRegisterRepository,
} from "@modules/account/presentation/interfaces/repositories";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeFindOneAccountRepository(): IFindOneAccountRepository {
    return new KnexFindOneAccountRepository();
  }

  makeLoginRepository(language: IAccountLanguage): ILoginRepository {
    return new KnexLoginRepository(
      this.makeFindOneAccountRepository(),
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
