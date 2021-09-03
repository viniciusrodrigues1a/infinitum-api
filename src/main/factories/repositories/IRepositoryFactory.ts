import { IRegisterRepository } from "@modules/account/infra/repositories/KnexRegisterRepository";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterRepository(language: IAccountLanguage): IRegisterRepository;
  makeDoesAccountExistRepository(): IDoesAccountExistRepository;
}
