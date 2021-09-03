import { IInvalidPasswordErrorLanguage } from "@modules/account/presentation/languages/IInvalidPasswordErrorLanguage";
import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { jwtToken } from "../authentication";
import { pbkdf2 } from "../cryptography";
import { RegisterRepositoryDTO } from "../DTOs/RegisterRepositoryDTO";
import { InvalidPasswordError } from "./errors";

export interface ILoginRepository {
  login(data: Omit<RegisterRepositoryDTO, "name">): Promise<string>;
}

export class KnexLoginRepository implements ILoginRepository {
  constructor(
    private readonly findOneAccountRepository: IFindOneAccountRepository,
    private readonly accountNotFoundErrorLanguage: IAccountNotFoundErrorLanguage,
    private readonly invalidPasswordErrorLanguage: IInvalidPasswordErrorLanguage
  ) {}

  async login({
    email,
    password,
  }: Omit<RegisterRepositoryDTO, "name">): Promise<string> {
    const account = (await this.findOneAccountRepository.findOneAccount(
      email
    )) as any;

    if (!account) {
      throw new AccountNotFoundError(email, this.accountNotFoundErrorLanguage);
    }

    const doesPasswordMatch = pbkdf2.compare(password, {
      hash: account.password_hash,
      salt: account.salt,
      iterations: account.iterations,
    });
    if (!doesPasswordMatch) {
      throw new InvalidPasswordError(this.invalidPasswordErrorLanguage);
    }

    return jwtToken.sign({ id: account.id });
  }
}