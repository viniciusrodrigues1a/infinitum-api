import { Account } from "@modules/account/entities/Account";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";

export class KnexAccountRepository
  implements IDoesAccountExistRepository, IFindOneAccountRepository
{
  async findOneAccount(email: string): Promise<Account | undefined> {
    const account = await connection("account")
      .select("*")
      .where({ email })
      .first();

    return account;
  }
  async doesAccountExist(email: string): Promise<boolean> {
    const account = await connection("account")
      .select("email")
      .where({ email })
      .first();

    return !!account;
  }
}
