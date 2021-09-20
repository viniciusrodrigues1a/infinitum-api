import { ILanguage } from "@modules/account/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import { CreateProjectUseCase } from "@modules/project/use-cases";
import { IRepositoryFactory, knexRepositoryFactoryImpl } from "../repositories";
import { IUseCaseFactory } from "./IUseCaseFactory";

class KnexUseCaseFactoryImpl implements IUseCaseFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeCreateProjectUseCase(language: ILanguage): CreateProjectUseCase {
    return new CreateProjectUseCase(
      this.repositoryFactory.makeCreateProjectRepository(),
      language
    );
  }

  makeFindOneAccountUseCase(language: ILanguage): FindOneAccountUseCase {
    return new FindOneAccountUseCase(
      this.repositoryFactory.makeFindOneAccountRepository(),
      language
    );
  }
}

export const knexUseCaseFactoryImpl = new KnexUseCaseFactoryImpl();
