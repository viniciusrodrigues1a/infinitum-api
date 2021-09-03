import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages/IInvalidCredentialsErrorLanguage";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { jwtToken } from "../authentication";
import { pbkdf2 } from "../cryptography";
import { RegisterRepositoryDTO } from "../DTOs/RegisterRepositoryDTO";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

export interface ILoginRepository {
  login(data: Omit<RegisterRepositoryDTO, "name">): Promise<string>;
}

export class KnexLoginRepository implements ILoginRepository {
  constructor(
    private readonly findOneAccountRepository: IFindOneAccountRepository,
    private readonly invalidCredentialsErrorLanguage: IInvalidCredentialsErrorLanguage
  ) {}

  async login({
    email,
    password,
  }: Omit<RegisterRepositoryDTO, "name">): Promise<string> {
    const account = (await this.findOneAccountRepository.findOneAccount(
      email
    )) as any;

    if (!account) {
      throw new InvalidCredentialsError(this.invalidCredentialsErrorLanguage);
    }

    const doesPasswordMatch = pbkdf2.compare(password, {
      hash: account.password_hash,
      salt: account.salt,
      iterations: account.iterations,
    });
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError(this.invalidCredentialsErrorLanguage);
    }

    return jwtToken.sign({ id: account.id });
  }
}
