import { IAccountNotFoundErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { IDoesAccountExistRepository } from "@shared/use-cases/interfaces/repositories";
import { Project } from "../entities";
import { CreateProjectDTO } from "./DTOs";
import { ICreateProjectRepository } from "./interfaces/repositories";

export class CreateProjectUseCase {
  constructor(
    private readonly createProjectRepository: ICreateProjectRepository,
    private readonly notFutureDateErrorLanguage: INotFutureDateErrorLanguage
  ) {}

  async create({
    name,
    description,
    beginsAt,
    finishesAt,
    participants,
    issues,
    accountEmailMakingRequest,
  }: CreateProjectDTO): Promise<void> {
    const project = new Project(
      {
        name,
        description,
        beginsAt,
        finishesAt,
        participants,
        issues,
      },
      this.notFutureDateErrorLanguage
    );

    await this.createProjectRepository.createProject({
      ...project,
      ownerEmail: accountEmailMakingRequest,
    });
  }
}
