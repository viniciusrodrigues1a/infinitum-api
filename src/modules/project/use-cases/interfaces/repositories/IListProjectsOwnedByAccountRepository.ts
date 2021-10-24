import { Project } from "@modules/project/entities";

export interface IListProjectsOwnedByAccountRepository {
  listProjects(accountEmail: string): Promise<Project[]>;
}
