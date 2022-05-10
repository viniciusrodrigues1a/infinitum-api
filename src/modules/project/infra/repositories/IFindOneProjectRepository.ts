import { Project } from "@modules/project/entities";

export interface IFindOneProjectRepository {
  findOneProject(projectId: string): Promise<Project | undefined>;
}
