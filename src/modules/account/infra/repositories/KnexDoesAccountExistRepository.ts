import { connection } from "@shared/infra/database/connection";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";

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
