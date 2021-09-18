import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";
import { CreateProjectDTO } from "./DTOs";
import { ICreateProjectRepository } from "./interfaces/repositories";

export class CreateProjectUseCase {
  constructor(
    private readonly createProjectRepository: ICreateProjectRepository,
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly accountNotFoundErrorLanguage: IAccountNotFoundErrorLanguage
  ) {}

  async create({
    name,
    description,
    beginsAt,
    finishesAt,
    participants,
    issues,
    accountEmailRequestingCreation,
  }: CreateProjectDTO): Promise<void> {
    const accountExists =
      await this.doesAccountExistRepository.doesAccountExist(
        accountEmailRequestingCreation
      );
    if (!accountExists) {
      throw new AccountNotFoundError(
        accountEmailRequestingCreation,
        this.accountNotFoundErrorLanguage
      );
    }

    await this.createProjectRepository.createProject({
      name,
      description,
      beginsAt,
      finishesAt,
      participants,
      issues,
      accountEmailRequestingCreation,
    });
  }
}
