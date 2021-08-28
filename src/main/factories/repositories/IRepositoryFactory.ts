import { IRegisterAccountRepository } from "@modules/account/infra/repositories";

export interface IRepositoryFactory {
  makeRegisterAccountRepository(): IRegisterAccountRepository;
}
