import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { Project } from "../entities";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "../entities/interfaces/languages";
import { CreateProjectDTO } from "./DTOs";
import { ICreateProjectRepository } from "./interfaces/repositories";

export class CreateProjectUseCase {
  constructor(
    private readonly createProjectRepository: ICreateProjectRepository,
    private readonly notFutureDateErrorLanguage: INotFutureDateErrorLanguage,
    private readonly beginsAtMustBeBeforeFinishesAtErrorLanguage: IBeginsAtMustBeBeforeFinishesAtErrorLanguage
  ) {}

  async create({
    name,
    description,
    beginsAt,
    finishesAt,
    participants,
    issueGroups,
    accountEmailMakingRequest,
  }: CreateProjectDTO): Promise<string> {
    const project = new Project(
      {
        name,
        description,
        beginsAt,
        finishesAt,
        participants,
        issueGroups,
      },
      this.notFutureDateErrorLanguage,
      this.beginsAtMustBeBeforeFinishesAtErrorLanguage
    );

    await this.createProjectRepository.createProject({
      ...project,
      ownerEmail: accountEmailMakingRequest,
    });

    return project.projectId;
  }
}
