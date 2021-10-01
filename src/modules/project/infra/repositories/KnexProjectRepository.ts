import { CreateProjectRepositoryDTO } from "@modules/project/use-cases/DTOs";
import {
  ICreateProjectRepository,
  IDeleteProjectRepository,
  IDoesProjectExistRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";

export class KnexProjectRepository
  implements
    ICreateProjectRepository,
    IDeleteProjectRepository,
    IDoesProjectExistRepository
{
  async doesProjectExist(projectId: string): Promise<boolean> {
    const project = await connection("project")
      .select("id")
      .where({ id: projectId })
      .first();

    return !!project;
  }

  async deleteProject(projectId: string): Promise<void> {
    await connection("project").where({ id: projectId }).del();
  }

  async createProject({
    projectId,
    name,
    description,
    beginsAt,
    finishesAt,
    ownerEmail,
  }: CreateProjectRepositoryDTO): Promise<void> {
    const ownerId = connection("account")
      .select("id")
      .where({ email: ownerEmail })
      .first();

    const ownerRoleId = connection("project_role")
      .select("id")
      .where({ name: "owner" })
      .first();

    try {
      await connection.transaction(async (trx) => {
        await trx("project").insert({
          id: projectId,
          owner_id: ownerId,
          name,
          description,
          begins_at: beginsAt,
          finishes_at: finishesAt,
        });

        await trx("account_project_project_role").insert({
          account_id: ownerId,
          project_id: projectId,
          project_role_id: ownerRoleId,
        });
      });
    } catch (err) {
      throw new Error("Transaction failed");
    }
  }
}
