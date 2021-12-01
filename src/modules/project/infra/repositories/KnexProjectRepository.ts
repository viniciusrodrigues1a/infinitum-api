import { Issue } from "@modules/issue/entities";
import { Project } from "@modules/project/entities";
import {
  IssueGroup,
  Participant,
  Role,
} from "@modules/project/entities/value-objects";
import {
  IFindProjectImageBufferRepository,
  IUpdateProjectImageRepository,
  UpdateProjectImageRepositoryDTO,
} from "@modules/project/presentation/interfaces/repositories";
import {
  CreateInvitationTokenRepositoryDTO,
  CreateIssueGroupForProjectRepositoryDTO,
  CreateProjectRepositoryDTO,
  KickParticipantFromProjectRepositoryDTO,
  RevokeInvitationRepositoryDTO,
  UpdateParticipantRoleInProjectRepositoryDTO,
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
  IIsProjectArchivedRepository,
  IFindProjectIdByIssueGroupIdRepository,
  IFindProjectIdByIssueIdRepository,
  ICreateInvitationTokenRepository,
  IHasAccountBeenInvitedToProjectRepository,
  IIsInvitationTokenValidRepository,
  IAcceptInvitationTokenRepository,
  IRevokeInvitationRepository,
  IUpdateParticipantRoleInProjectRepository,
} from "@modules/project/use-cases/interfaces/repositories";
import { IKickParticipantFromProjectRepository } from "@modules/project/use-cases/interfaces/repositories/IKickParticipantFromProjectRepository";
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
    IHasProjectBegunRepository,
    IIsProjectArchivedRepository,
    IFindProjectIdByIssueGroupIdRepository,
    IFindProjectIdByIssueIdRepository,
    ICreateInvitationTokenRepository,
    IHasAccountBeenInvitedToProjectRepository,
    IIsInvitationTokenValidRepository,
    IAcceptInvitationTokenRepository,
    IKickParticipantFromProjectRepository,
    IRevokeInvitationRepository,
    IUpdateParticipantRoleInProjectRepository,
    IUpdateProjectImageRepository,
    IFindProjectImageBufferRepository
{
  async findProjectImageBuffer(projectId: string): Promise<Buffer | undefined> {
    const project = await connection("project")
      .select("image")
      .where({ id: projectId })
      .first();

    if (!project.image) return undefined;

    const buffer = Buffer.from(project.image, "base64");

    return buffer;
  }

  async updateProjectImage({
    projectId,
    fileBuffer,
  }: UpdateProjectImageRepositoryDTO): Promise<void> {
    await connection("project")
      .update({
        image: fileBuffer,
      })
      .where({ id: projectId });
  }

  async updateParticipantRole({
    roleName,
    projectId,
    accountEmail,
  }: UpdateParticipantRoleInProjectRepositoryDTO): Promise<void> {
    const accountId = await this.findAccountIdByEmail(accountEmail);

    const roleId = await this.findRoleIdByRoleName(roleName);

    await connection("account_project_project_role")
      .where({ account_id: accountId, project_id: projectId })
      .update({
        project_role_id: roleId,
      });
  }

  async revokeInvitation({
    projectId,
    accountEmail,
  }: RevokeInvitationRepositoryDTO): Promise<void> {
    const accountId = await this.findAccountIdByEmail(accountEmail);

    await connection("project_invitation")
      .where({
        account_id: accountId,
        project_id: projectId,
      })
      .del();
  }

  async kickParticipant({
    projectId,
    accountEmail,
  }: KickParticipantFromProjectRepositoryDTO): Promise<void> {
    const accountId = await this.findAccountIdByEmail(accountEmail);

    await connection("account_project_project_role")
      .where({
        project_id: projectId,
        account_id: accountId,
      })
      .del();
  }

  async acceptInvitationToken(token: string): Promise<void> {
    const invitation = await connection("project_invitation")
      .select("*")
      .where({ token })
      .first();

    await connection("account_project_project_role").insert({
      account_id: invitation.account_id,
      project_id: invitation.project_id,
      project_role_id: invitation.project_role_id,
    });

    await connection("project_invitation").where({ token }).del();
  }

  async isInvitationTokenValid(token: string): Promise<boolean> {
    const invitation = await connection("project_invitation")
      .select("*")
      .where({ token })
      .first();

    return !!invitation;
  }

  async hasAccountBeenInvited({
    projectId,
    accountEmail,
  }: DoesParticipantExistRepositoryDTO): Promise<boolean> {
    const accountId = await this.findAccountIdByEmail(accountEmail);

    const invitation = await connection("project_invitation")
      .select("*")
      .where({ account_id: accountId, project_id: projectId })
      .first();

    return !!invitation;
  }

  async createInvitationToken({
    projectId,
    accountEmail,
    roleName,
    token,
  }: CreateInvitationTokenRepositoryDTO): Promise<void> {
    const roleId = await this.findRoleIdByRoleName(roleName);
    const accountId = await this.findAccountIdByEmail(accountEmail);

    await connection("project_invitation").insert({
      project_role_id: roleId,
      account_id: accountId,
      project_id: projectId,
      token,
    });
  }

  async findProjectIdByIssueId(issueId: string): Promise<string | undefined> {
    const issue = await connection("issue")
      .select("issue_group_id")
      .where({ id: issueId })
      .first();

    if (!issue) return undefined;

    const projectId = await this.findProjectIdByIssueGroupId(
      issue.issue_group_id
    );

    return projectId;
  }

  async findProjectIdByIssueGroupId(
    issueGroupId: string
  ): Promise<string | undefined> {
    const issueGroup = await connection("issue_group")
      .select("project_id")
      .where({ id: issueGroupId })
      .first();

    if (!issueGroup) return undefined;

    return issueGroup.project_id;
  }

  async isProjectArchived(projectId: string): Promise<boolean> {
    const { archived: isArchived } = await connection("project")
      .select("archived")
      .where({ id: projectId })
      .first();

    return !!isArchived;
  }

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
    const accountId = await this.findAccountIdByEmail(accountEmail);

    const projects = await connection("account_project_project_role")
      .leftJoin(
        "project",
        "account_project_project_role.project_id",
        "=",
        "project.id"
      )
      .select(
        "project.id as id",
        "project.name as name",
        "project.description as description",
        "project.created_at as createdAt",
        "project.begins_at as beginsAt",
        "project.finishes_at as finishesAt"
      )
      .where({ account_id: accountId });

    const formattedProjects: Project[] = [];

    /* eslint-disable */
    for (const project of projects) {
      const issueGroups = await this.listIssueGroupsByProjectId(project.id);
      const participants = await this.listParticipantsByProjectId(project.id);

      formattedProjects.push({
        projectId: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.created_at,
        beginsAt: project.begins_at,
        finishesAt: project.finishes_at,
        participants,
        issueGroups,
      } as Project);
    }

    return formattedProjects;
  }

  async listIssueGroupsByProjectId(projectId: string): Promise<IssueGroup[]> {
    const issueGroups = await connection("issue_group").select("*").where({
      project_id: projectId,
    });

    const formattedIssueGroups: IssueGroup[] = [];

    for (const issueGroup of issueGroups) {
      const issues = await this.listIssuesByIssueGroupId(issueGroup.id);

      formattedIssueGroups.push({
        issues,
        title: issueGroup.title,
        issueGroupId: issueGroup.id,
        shouldUpdateIssuesToCompleted: Boolean(issueGroup.is_final),
      });
    }

    return formattedIssueGroups;
  }

  async listIssuesByIssueGroupId(issueGroupId: string): Promise<Issue[]> {
    const issues = await connection("issue")
      .leftJoin("account", "issue.assigned_to_account_id", "=", "account.id")
      .select(
        "issue.id as issue_id",
        "issue.title as issue_title",
        "issue.description as issue_description",
        "issue.completed as issue_completed",
        "issue.created_at as issue_created_at",
        "issue.expires_at as issue_expires_at",
        "account.email as account_email"
      )
      .where({ issue_group_id: issueGroupId })
      .orderBy("issue.created_at");

    const formattedIssues: Issue[] = issues.map((i) => ({
      issueId: i.issue_id,
      title: i.issue_title,
      description: i.issue_description,
      completed: Boolean(i.issue_completed),
      createdAt: new Date(i.issue_created_at),
      expiresAt: i.issue_expires_at ? new Date(i.issue_expires_at) : undefined,
      assignedToEmail: i.account_email || undefined,
    }));

    return formattedIssues;
  }

  async listParticipantsByProjectId(projectId: string): Promise<Participant[]> {
    const participants = await connection("account_project_project_role")
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
        "account.name as account_name",
        "account.email as account_email",
        "project_role.name as role_name"
      )
      .where({ project_id: projectId })
      .orderBy("account_project_project_role.created_at");

    const formattedParticipants: Participant[] = participants.map((p) => ({
      account: {
        name: p.account_name,
        email: p.account_email,
      },
      role: { name: { value: p.role_name } } as Role,
    }));

    return formattedParticipants;
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
        begins_at: beginsAt,
        finishes_at: finishesAt,
      })
      .where({ id: projectId });
  }

  async findParticipantRole({
    accountEmail,
    projectId,
  }: FindParticipantRoleInProjectRepositoryDTO): Promise<string> {
    const accountId = await this.findAccountIdByEmail(accountEmail);

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
    const accountId = await this.findAccountIdByEmail(accountEmail);

    if (!accountId) return false;

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

  private async findAccountIdByEmail(
    accountEmail: string
  ): Promise<string | undefined> {
    const account = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

    if (!account) return undefined;

    return account.id;
  }

  private async findRoleIdByRoleName(roleName: string): Promise<string> {
    const { id: roleId } = await connection("project_role")
      .select("id")
      .where({ name: roleName })
      .first();

    return roleId;
  }
}
