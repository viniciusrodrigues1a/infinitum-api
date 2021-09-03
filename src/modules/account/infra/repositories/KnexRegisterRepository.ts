import crypto from "crypto";
import { connection } from "@shared/infra/database/connection";
import { Account } from "@modules/account/entities/Account";
import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IEmailAlreadyInUseErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { RegisterRepositoryDTO } from "../DTOs/RegisterRepositoryDTO";
import { pbkdf2 } from "../cryptography";

export interface IRegisterRepository {
  create(data: RegisterRepositoryDTO): Promise<void>;
}

export class KnexRegisterRepository implements IRegisterRepository {
  constructor(
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly invalidEmailErrorLanguage: IInvalidEmailErrorLanguage,
    private readonly emailAlreadyInUseErrorLanguage: IEmailAlreadyInUseErrorLanguage
  ) {}

  async create({
    name,
    email,
    password,
  }: RegisterRepositoryDTO): Promise<void> {
    const account = new Account(name, email, this.invalidEmailErrorLanguage);

    const accountAlreadyExists =
      await this.doesAccountExistRepository.doesAccountExist(account.email);
    if (accountAlreadyExists) {
      throw new EmailAlreadyInUseError(
        email,
        this.emailAlreadyInUseErrorLanguage
      );
    }

    const uuid = crypto.randomUUID();

    const { hash, salt, iterations } = pbkdf2.hash(password);

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