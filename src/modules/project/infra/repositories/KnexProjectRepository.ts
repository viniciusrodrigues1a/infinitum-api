import { Project } from "@modules/project/entities";
import {
  CreateIssueGroupForProjectRepositoryDTO,
  CreateProjectRepositoryDTO,
  UpdateProjectRepositoryDTO,
} from "@modules/project/use-cases/DTOs";
import {
  ICreateIssueGroupForProjectRepository,
  ICreateProjectRepository,
  IDeleteProjectRepository,
  IDoesParticipantExistRepository,
  IDoesProjectExistRepository,
  IFindParticipantRoleInProjectRepository,
  IListProjectsOwnedByAccountRepository,
  IUpdateProjectRepository,
  IHasProjectBegunRepository,
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
    IUpdateProjectRepository,
    IListProjectsOwnedByAccountRepository,
    ICreateIssueGroupForProjectRepository,
    IHasProjectBegunRepository
{
  async hasProjectBegun(projectId: string): Promise<boolean> {
    const { begins_at: beginsAt } = await connection("project")
      .select("begins_at")
      .where({ id: projectId })
      .first();

    if (!beginsAt) return true;

    const nowMs = new Date().getTime();
    const beginsAtMs = new Date(beginsAt).getTime();

    return nowMs - beginsAtMs > 0;
  }

  async createIssueGroup({
    issueGroupId,
    projectId,
    title,
  }: CreateIssueGroupForProjectRepositoryDTO): Promise<void> {
    await connection("issue_group").insert({
      id: issueGroupId,
      project_id: projectId,
      title,
    });
  }

  async listProjects(accountEmail: string): Promise<Project[]> {
    const { id: accountId } = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

    const projects = await connection("project")
      .leftJoin(
        "account_project_project_role",
        "project.id",
        "=",
        "account_project_project_role.project_id"
      )
      .leftJoin(
        "account",
        "account_project_project_role.account_id",
        "=",
        "account.id"
      )
      .leftJoin(
        "project_role",
        "account_project_project_role.project_role_id",
        "=",
        "project_role.id"
      )
      .select(
        "project.*",
        "account.name as account_name",
        "account.email as account_email",
        "account_project_project_role.account_id",
        "project_role.name as project_role_name"
      )
      .where({ owner_id: accountId });

    const reducedProjects = projects.reduce((acc: Array<any>, val) => {
      const index = acc.findIndex((p) => p.projectId === val.id);

      if (index !== -1) {
        acc[index].participants = [
          ...acc[index].participants,
          {
            id: val.account_id,
            name: val.account_name,
            email: val.account_email,
            projectRoleName: val.project_role_name,
          },
        ];
      } else {
        acc.push({
          projectId: val.id,
          name: val.name,
          description: val.description,
          beginsAt: val.begins_at,
          finishesAt: val.finishes_at,
          createdAt: val.created_at,
          archived: val.archived,
          issues: [],
          participants: [
            {
              id: val.account_id,
              name: val.account_name,
              email: val.account_email,
              projectRoleName: val.project_role_name,
            },
          ],
        });
      }

      return acc;
    }, []);

    return reducedProjects;
  }

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
