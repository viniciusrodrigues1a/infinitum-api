import crypto from "crypto";
import { RegisterRepositoryDTO } from "@modules/account/presentation/DTOs";
import {
  ILoginRepository,
  LoginRepositoryTokens,
} from "@modules/account/presentation/interfaces/repositories";
import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages";
import { IFindOneAccountRepository } from "@modules/account/use-cases/interfaces/repositories/IFindOneAccountRepository";
import { connection } from "@shared/infra/database/connection";
import moment from "moment";
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
  }: Omit<
    RegisterRepositoryDTO,
    "name" | "languageIsoCode"
  >): Promise<LoginRepositoryTokens> {
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

    await connection("refresh_token").del().where({ account_id: account.id });
    const refreshToken = crypto.randomUUID();
    await connection("refresh_token").insert({
      id: crypto.randomUUID(),
      account_id: account.id,
      token: refreshToken,
      expires_at: moment().utc().add(7, "days"),
    });

    return {
      accessToken: jwtToken.sign({ email }),
      refreshToken,
    };
  }
}
