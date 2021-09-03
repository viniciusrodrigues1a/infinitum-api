import { Account } from "@modules/account/entities/Account";

export interface IFindOneAccountRepository {
  findOneAccount(email: string): Promise<Account | undefined>;
}
