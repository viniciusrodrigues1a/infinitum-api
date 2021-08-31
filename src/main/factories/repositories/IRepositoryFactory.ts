import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
import { ILanguage } from "@modules/account/presentation/languages/ILanguage";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterAccountRepository(
    language: ILanguage
  ): IRegisterAccountRepository;
  makeDoesAccountExistRepository(
    language: ILanguage
  ): IDoesAccountExistRepository;
}
