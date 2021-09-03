import { Account } from "@modules/account/entities/Account";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { connection } from "@shared/infra/database/connection";

export class KnexFindOneAccountRepository implements IFindOneAccountRepository {
  async findOneAccount(email: string): Promise<Account | undefined> {
    const account = await connection("account")
      .select("*")
      .where({ email })
      .first();

    return account;
  }
}
