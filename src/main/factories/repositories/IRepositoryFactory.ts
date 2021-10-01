import {
  ILoginRepository,
  IRegisterRepository,
} from "@modules/account/presentation/interfaces/repositories";
import { ILanguage } from "@modules/account/presentation/languages";
import {
  IFindOneAccountRepository,
  IDoesAccountExistRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { ICreateProjectRepository } from "@modules/project/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterRepository(language: ILanguage): IRegisterRepository;
  makeLoginRepository(language: ILanguage): ILoginRepository;
  makeDoesAccountExistRepository(): IDoesAccountExistRepository;
  makeFindOneAccountRepository(): IFindOneAccountRepository;
  makeCreateProjectRepository(): ICreateProjectRepository;
}
