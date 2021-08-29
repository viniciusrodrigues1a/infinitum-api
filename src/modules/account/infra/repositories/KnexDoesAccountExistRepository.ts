import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";

export class KnexDoesAccountExistRepository
  implements IDoesAccountExistRepository
{
  async doesAccountExist(email: string): Promise<boolean> {
    const account = await connection("account")
      .select("email")
      .where({ email })
      .first();

    return !!account;
  }
}
