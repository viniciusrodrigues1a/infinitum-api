import {
  CreateProjectRepositoryDTO,
  UpdateProjectRepositoryDTO,
} from "@modules/project/use-cases/DTOs";
import {
  ICreateProjectRepository,
  IDeleteProjectRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IUpdateProjectRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";
import {
  DoesParticipantExistRepositoryDTO,
  FindParticipantRoleInProjectRepositoryDTO,
} from "@shared/use-cases/DTOs";

export class KnexProjectRepository
  implements
    ICreateProjectRepository,
    IDeleteProjectRepository,
    IDoesProjectExistRepository,
    IDoesParticipantExistRepository,
    IFindParticipantRoleInProjectRepository,
    IUpdateProjectRepository
{
  async updateProject({
    projectId,
    name,
    beginsAt,
    finishesAt,
    description,
  }: UpdateProjectRepositoryDTO): Promise<void> {
    await connection("project")
      .update({
        name,
        description,
        beginsAt,
        finishesAt,
      })
      .where({ id: projectId });
  }

  async findParticipantRole({
    accountEmail,
    projectId,
  }: FindParticipantRoleInProjectRepositoryDTO): Promise<string> {
    const { id: accountId } = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

    const { project_role_id: projectRoleId } = await connection(
      "account_project_project_role"
    )
      .select("project_role_id")
      .where({
        account_id: accountId,
        project_id: projectId,
      })
      .first();

    const { name: projectRoleName } = await connection("project_role")
      .select("name")
      .where({ id: projectRoleId })
      .first();

    return projectRoleName;
  }

  async doesParticipantExist({
    accountEmail,
    projectId,
  }: DoesParticipantExistRepositoryDTO): Promise<boolean> {
    const { id: accountId } = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

    const accountProjectRelationshipExists = await connection(
      "account_project_project_role"
    )
      .select("*")
      .where({
        account_id: accountId,
        project_id: projectId,
      })
      .first();

    return !!accountProjectRelationshipExists;
  }

  async doesProjectExist(projectId: string): Promise<boolean> {
    try {
      const project = await connection("project")
        .select("id")
        .where({ id: projectId })
        .first();

      return !!project;
    } catch (err) {
      if (err.message.includes("invalid input syntax for type uuid"))
        return false;

      throw err;
    }
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
