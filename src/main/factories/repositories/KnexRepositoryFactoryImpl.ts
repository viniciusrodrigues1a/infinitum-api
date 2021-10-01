import {
  KnexLoginRepository,
  KnexRegisterRepository,
  KnexAccountRepository,
} from "@modules/account/infra/repositories";
import {
  ILoginRepository,
  IRegisterRepository,
} from "@modules/account/presentation/interfaces/repositories";
import { ILanguage } from "@modules/account/presentation/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories";
import { KnexProjectRepository } from "@modules/project/infra/repositories/KnexProjectRepository";
import { ICreateProjectRepository } from "@modules/project/use-cases/interfaces/repositories";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeCreateProjectRepository(): ICreateProjectRepository {
    return this.makeProjectRepository();
  }

  makeFindOneAccountRepository(): IFindOneAccountRepository {
    return this.makeAccountRepository();
  }

  makeDoesAccountExistRepository(): IDoesAccountExistRepository {
    return this.makeAccountRepository();
  }

  makeLoginRepository(language: ILanguage): ILoginRepository {
    return new KnexLoginRepository(
      this.makeFindOneAccountRepository(),
      language
    );
  }

  makeRegisterRepository(language: ILanguage): IRegisterRepository {
    return new KnexRegisterRepository(
      this.makeDoesAccountExistRepository(),
      language,
      language
    );
  }

  private makeAccountRepository(): KnexAccountRepository {
    return new KnexAccountRepository();
  }

  private makeProjectRepository(): KnexProjectRepository {
    return new KnexProjectRepository();
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
