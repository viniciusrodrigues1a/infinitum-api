import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";

export interface IRepositoryFactory {
  makeRegisterAccountRepository(): IRegisterAccountRepository;
  makeDoesAccountExistRepository(): IDoesAccountExistRepository;
}
