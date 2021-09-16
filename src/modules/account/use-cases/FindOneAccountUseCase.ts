import { Account } from "../entities/Account";
import { AccountNotFoundError } from "./errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "./interfaces/languages";
import { IFindOneAccountRepository } from "./interfaces/repositories";

export class FindOneAccountUseCase {
  constructor(
    private readonly findOneAccountRepository: IFindOneAccountRepository,
    private readonly accountNotFoundErrorLanguage: IAccountNotFoundErrorLanguage
  ) {}

  async findOne(email: string): Promise<Account> {
    const account = await this.findOneAccountRepository.findOneAccount(email);

    if (!account) {
      throw new AccountNotFoundError(email, this.accountNotFoundErrorLanguage);
    }

    return account;
  }
}
