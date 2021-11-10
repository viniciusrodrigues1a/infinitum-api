import { Project } from "@modules/project/entities";
import {
  CreateInvitationTokenRepositoryDTO,
  CreateIssueGroupForProjectRepositoryDTO,
  CreateProjectRepositoryDTO,
  KickParticipantFromProjectRepositoryDTO,
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
    IKickParticipantFromProjectRepository
{
  async kickParticipant({
    projectId,
    accountEmail,
  }: KickParticipantFromProjectRepositoryDTO): Promise<void> {
    const { id: accountId } = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

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
    const { id: accountId } = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

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
    const { id: roleId } = await connection("project_role")
      .select("id")
      .where({ name: roleName })
      .first();
    const { id: accountId } = await connection("account")
      .select("id")
      .where({ email: accountEmail })
      .first();

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
      .leftJoin("issue_group", "project.id", "=", "issue_group.project_id")
      .leftJoin("issue", "issue_group.id", "=", "issue.issue_group_id")
      .select(
        "project.*",
        "account.name as account_name",
        "account.email as account_email",
        "account_project_project_role.account_id",
        "project_role.name as project_role_name",
        "issue_group.id as issue_group_id",
        "issue_group.title as issue_group_title",
        "issue_group.created_at as issue_group_created_at",
        "issue.id as issue_id",
        "issue.title as issue_title",
        "issue.description as issue_description",
        "issue.expires_at as issue_expires_at",
        "issue.created_at as issue_created_at"
      )
      .where("project.owner_id", "=", accountId);

    const reducedProjects = projects.reduce(
      (acc, val) => this.projectsOutputFormatter(acc, val),
      []
    );

    const projectsWithSortedIssues = reducedProjects.map((p: any) => ({
      ...p,
      issueGroups: p.issueGroups
        .map((ig: any) => ({
          ...ig,
          issues: ig.issues.sort(this.compareByCreatedAt),
        }))
        .sort(this.compareByCreatedAt),
    }));

    const sortedProjects = projectsWithSortedIssues.sort(
      this.compareByCreatedAt
    );

    sortedProjects.map((p: any) => ({
      id: p.projectId,
      createdAt: p.createdAt,
    }));

    return sortedProjects;
  }

  private compareByCreatedAt(
    a: { createdAt: string },
    b: { createdAt: string }
  ): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  private projectsOutputFormatter(acc: any, val: any): any {
    const index = acc.findIndex((p: any) => p.projectId === val.id);

    if (index !== -1) {
      this.accumulateProjectObject(acc, val, index);
    } else {
      const project = this.formatProjectObject(val);
      acc.push(project);
    }

    return acc;
  }

  private accumulateProjectObject(acc: any, val: any, index: number) {
    if (val.issue_group_id) {
      const issueGroupIndex = acc[index].issueGroups.findIndex(
        (issueGroup: any) => issueGroup.issueGroupId === val.issue_group_id
      );

      if (issueGroupIndex === -1) {
        const issues = val.issue_id ? [this.formatIssueObject(val)] : [];
        acc[index].issueGroups = [
          ...acc[index].issueGroups,
          this.formatIssueGroupObject(val, issues),
        ];
      } else {
        const issues = val.issue_id
          ? [
              ...acc[index].issueGroups[issueGroupIndex].issues,
              this.formatIssueObject(val),
            ]
          : [];

        acc[index].issueGroups[issueGroupIndex].issues = issues;
      }
    }
    acc[index].participants = [
      ...acc[index].participants,
      this.formatParticipantObject(val),
    ];
  }

  private formatProjectObject(val: any) {
    const issues = val.issue_id ? [this.formatIssueObject(val)] : [];
    const issueGroups = val.issue_group_id
      ? [this.formatIssueGroupObject(val, issues)]
      : [];
    const participants = [this.formatParticipantObject(val)];
    const project = {
      projectId: val.id,
      name: val.name,
      description: val.description,
      beginsAt: val.begins_at,
      finishesAt: val.finishes_at,
      createdAt: val.created_at,
      archived: val.archived,
      issueGroups,
      participants,
    };

    return project;
  }

  private formatIssueGroupObject(val: any, issues: any[]): any {
    return {
      issueGroupId: val.issue_group_id,
      title: val.issue_group_title,
      createdAt: val.issue_group_created_at,
      issues,
    };
  }

  private formatIssueObject(val: any): any {
    return {
      issueId: val.issue_id,
      title: val.issue_title,
      description: val.issue_description,
      expiresAt: val.issue_expires_at,
      createdAt: val.issue_created_at,
    };
  }

  private formatParticipantObject(val: any): any {
    return {
      id: val.account_id,
      name: val.account_name,
      email: val.account_email,
      projectRoleName: val.project_role_name,
    };
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
