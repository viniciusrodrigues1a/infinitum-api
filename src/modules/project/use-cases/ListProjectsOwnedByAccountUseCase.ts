import { Project } from "../entities";
import { IListProjectsOwnedByAccountRepository } from "./interfaces/repositories";

export class ListProjectsOwnedByAccountUseCase {
  constructor(
    private readonly listProjectsOwnedByAccountRepository: IListProjectsOwnedByAccountRepository
  ) {}

  async list(accountEmail: string): Promise<Omit<Project, "participants">[]> {
    const projects =
      await this.listProjectsOwnedByAccountRepository.listProjects(
        accountEmail
      );

    return projects;
  }
}
