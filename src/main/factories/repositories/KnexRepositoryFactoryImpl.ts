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
import { ILanguage } from "@modules/account/presentation/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories";
import { KnexCreateProjectRepository } from "@modules/project/infra/repositories";
import { ICreateProjectRepository } from "@modules/project/use-cases/interfaces/repositories";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeCreateProjectRepository(): ICreateProjectRepository {
    return new KnexCreateProjectRepository();
  }

  makeFindOneAccountRepository(): IFindOneAccountRepository {
    return new KnexFindOneAccountRepository();
  }

  makeLoginRepository(language: ILanguage): ILoginRepository {
    return new KnexLoginRepository(
      this.makeFindOneAccountRepository(),
      language
    );
  }

  makeDoesAccountExistRepository(): IDoesAccountExistRepository {
    return new KnexDoesAccountExistRepository();
  }

  makeRegisterRepository(language: ILanguage): IRegisterRepository {
    return new KnexRegisterRepository(
      this.makeDoesAccountExistRepository(),
      language,
      language
    );
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
