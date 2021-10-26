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
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { KnexIssueRepository } from "@modules/issue/infra/repositories";
import { KnexProjectRepository } from "@modules/project/infra/repositories/KnexProjectRepository";
import { ICreateProjectRepository } from "@modules/project/use-cases/interfaces/repositories";
import { IRepositoryFactory } from "./IRepositoryFactory";

class KnexRepositoryFactoryImpl implements IRepositoryFactory {
  makeIssueRepository(): KnexIssueRepository {
    return new KnexIssueRepository();
  }

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

  public makeAccountRepository(): KnexAccountRepository {
    return new KnexAccountRepository();
  }

  public makeProjectRepository(): KnexProjectRepository {
    return new KnexProjectRepository();
  }
}

export const knexRepositoryFactoryImpl = new KnexRepositoryFactoryImpl();
