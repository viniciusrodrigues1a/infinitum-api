import { RegisterRepositoryDTO } from "@modules/account/presentation/DTOs";
import { ILoginRepository } from "@modules/account/presentation/interfaces/repositories";
import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { jwtToken } from "../authentication";
import { pbkdf2 } from "../cryptography";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

export class KnexLoginRepository implements ILoginRepository {
  constructor(
    private readonly findOneAccountRepository: IFindOneAccountRepository,
    private readonly invalidCredentialsErrorLanguage: IInvalidCredentialsErrorLanguage
  ) {}

  async login({
    email,
    password,
  }: Omit<RegisterRepositoryDTO, "name" | "languageIsoCode">): Promise<string> {
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

    return jwtToken.sign({ email });
  }
}
