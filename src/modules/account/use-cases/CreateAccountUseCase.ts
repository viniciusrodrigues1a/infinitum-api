import { Account } from "../entities/Account";
import { CreateAccountDTO } from "./DTOs";
import { EmailAlreadyInUseError } from "./errors";
import {
  ICreateAccountRepository,
  IDoesAccountExistRepository,
} from "./interfaces/repositories";

export class CreateAccountUseCase {
  constructor(
    private createAccountRepository: ICreateAccountRepository,
    private doesAccountExistRepository: IDoesAccountExistRepository
  ) {}

  async create({ name, email }: CreateAccountDTO): Promise<void> {
    const account = new Account(name, email);

    const doesAccountExist =
      await this.doesAccountExistRepository.doesAccountExist(email);
    if (doesAccountExist) {
      throw new EmailAlreadyInUseError(email);
    }

    await this.createAccountRepository.create(account);
  }
}
