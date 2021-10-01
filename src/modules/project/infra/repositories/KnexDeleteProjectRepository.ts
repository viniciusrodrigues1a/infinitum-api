import { IDeleteProjectRepository } from "@modules/project/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";

export class KnexDeleteProjectRepository implements IDeleteProjectRepository {
  async deleteProject(projectId: string): Promise<void> {
    await connection("project").where({ id: projectId }).del();
  }
}
