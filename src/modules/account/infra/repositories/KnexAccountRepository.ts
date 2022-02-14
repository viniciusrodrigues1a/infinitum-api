import { Account } from "@modules/account/entities/Account";
import { UpdateAccountRepositoryDTO } from "@modules/account/presentation/DTOs";
import { IUpdateAccountRepository } from "@modules/account/presentation/interfaces/repositories";
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";
import { pbkdf2 } from "../cryptography";

export class KnexAccountRepository
  implements
    IDoesAccountExistRepository,
    IFindOneAccountRepository,
    IUpdateAccountRepository
{
  async updateAccount({
    email,
    newName,
    newEmail,
    newPassword,
  }: UpdateAccountRepositoryDTO): Promise<void> {
    const { id } = await connection("account")
      .select("*")
      .where({ email })
      .first();

    let updatedFields: any = { name: newName, email: newEmail };

    if (newPassword) {
      const { hash, salt, iterations } = pbkdf2.hash(newPassword);
      updatedFields = {
        ...updatedFields,
        password_hash: hash,
        salt,
        iterations,
      };
    }

    await connection("account").where({ id }).update(updatedFields);
  }

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
