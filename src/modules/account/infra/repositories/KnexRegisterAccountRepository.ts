import crypto from "crypto";
import { connection } from "@shared/infra/database/connection";
import { RegisterAccountRepositoryDTO } from "../DTOs/RegisterAccountRepositoryDTO";
import { Pbkdf2 } from "../cryptography";

export interface IRegisterAccountRepository {
  create(data: RegisterAccountRepositoryDTO): Promise<void>;
}

export class KnexRegisterAccountRepository
  implements IRegisterAccountRepository
{
  async create({
    name,
    email,
    password,
  }: RegisterAccountRepositoryDTO): Promise<void> {
    const uuid = crypto.randomUUID();

    const { hash, salt, iterations } = new Pbkdf2().hash(password);

    await connection("account").insert({
      id: uuid,
      name,
      email,
      password_hash: hash,
      salt,
      iterations,
    });
  }
}
