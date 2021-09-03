import { ILoginRepository } from "@modules/account/infra/repositories/KnexLoginRepository";
import { IRegisterRepository } from "@modules/account/infra/repositories/KnexRegisterRepository";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterRepository(language: IAccountLanguage): IRegisterRepository;
  makeLoginRepository(language: IAccountLanguage): ILoginRepository;
  makeDoesAccountExistRepository(): IDoesAccountExistRepository;
  makeFindOneAccountRepository(): IFindOneAccountRepository;
}
