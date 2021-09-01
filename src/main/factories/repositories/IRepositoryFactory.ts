import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
import { IAccountLanguage } from "@modules/account/presentation/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterAccountRepository(
    language: IAccountLanguage
  ): IRegisterAccountRepository;
  makeDoesAccountExistRepository(): IDoesAccountExistRepository;
}
