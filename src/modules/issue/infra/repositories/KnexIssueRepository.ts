import { Issue } from "@modules/issue/entities";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "@modules/issue/presentation/interfaces/languages";
import {
  AllIssuesMetrics,
  ExpiredIssuesMetrics,
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesWeeklyOverviewMetricsRepository,
  IssuesForTodayMetrics,
  IssuesWeeklyOverviewMetrics,
} from "@modules/issue/presentation/interfaces/repositories";
import {
  CreateIssueRepositoryDTO,
  MoveIssueToAnotherIssueGroupRepositoryDTO,
  UpdateIssueRepositoryDTO,
} from "@modules/issue/use-cases/DTOs";
import {
  ICreateIssueRepository,
  IDeleteIssueRepository,
  IDoesIssueExistRepository,
  IDoesIssueGroupExistRepository,
  IFindOneIssueRepository,
  IMoveIssueToAnotherIssueGroupRepository,
  IShouldIssueGroupUpdateIssuesToCompletedRepository,
  IUpdateIssueRepository,
} from "@modules/issue/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";
import moment from "moment";

export class KnexIssueRepository
  implements
    ICreateIssueRepository,
    IDoesIssueExistRepository,
    IDeleteIssueRepository,
    IUpdateIssueRepository,
    IFindOneIssueRepository,
    IReportExpiredIssuesMetricsRepository,
    IReportIssuesForTodayMetricsRepository,
    IReportAllIssuesMetricsRepository,
    IReportIssuesWeeklyOverviewMetricsRepository,
    IDoesIssueGroupExistRepository,
    IShouldIssueGroupUpdateIssuesToCompletedRepository,
    IMoveIssueToAnotherIssueGroupRepository
{
  async moveIssue({
    issueId,
    moveToIssueGroupId,
  }: MoveIssueToAnotherIssueGroupRepositoryDTO): Promise<void> {
    await connection("issue")
      .where({
        id: issueId,
      })
      .update("issue_group_id", moveToIssueGroupId);
  }

  async shouldIssueGroupUpdateIssues(issueGroupId: string): Promise<boolean> {
    const issueGroup = await connection("issue_group")
      .select("is_final")
      .where({ id: issueGroupId })
      .first();

    return Boolean(issueGroup.is_final);
  }

  async doesIssueGroupExist(issueGroupId: string): Promise<boolean> {
    try {
      const issueGroup = await connection("issue_group")
        .select("id")
        .where({ id: issueGroupId })
        .first();

      return !!issueGroup;
    } catch (err) {
      if (err.message.includes("invalid input syntax for type uuid"))
        return false;

      throw err;
    }
  }

  async reportIssuesWeeklyOverview(
    { accountEmailMakingRequest }: AccountMakingRequestDTO,
    issuesWeeklyOverviewWeekdaysLanguage: IIssuesWeeklyOverviewWeekdaysLanguage
  ): Promise<IssuesWeeklyOverviewMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    const weekDaysName =
      issuesWeeklyOverviewWeekdaysLanguage.getIssuesWeeklyOverviewWeekdays();
    const weekDays: any = {};

    const nowUtc = moment().utc();

    for (let i = 0; i < 7; i++) {
      const start = moment(nowUtc).day(i);
      start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const end = moment(nowUtc).day(i);
      end.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

      weekDays[weekDaysName[i]] = {
        issuesCompleted: 0,
        start,
        end,
      };
    }

    const issues = await connection("issue")
      .select("*")
      .where({ assigned_to_account_id: accountId, completed: true });

    issues.forEach((issue) => {
      if (issue.expires_at) {
        Object.keys(weekDays).forEach((key) => {
          if (
            moment(issue.expires_at).isBetween(
              weekDays[key].start.toISOString(),
              weekDays[key].end.toISOString()
            )
          ) {
            weekDays[key].issuesCompleted += 1;
          }
        });
      }
    });

    const formattedWeekOverview = Object.keys(weekDays).map((key) => ({
      date: key,
      value: weekDays[key].issuesCompleted,
    }));

    return formattedWeekOverview as IssuesWeeklyOverviewMetrics;
  }

  async reportAllIssues({
    accountEmailMakingRequest,
  }: AccountMakingRequestDTO): Promise<AllIssuesMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    let issues = await connection("issue")
      .select(
        "issue.id as issueId",
        "issue.title as title",
        "issue.description as description",
        "issue.created_at as createdAt",
        "issue.expires_at as expiresAt",
        "issue.completed as completed"
      )
      .where({ assigned_to_account_id: accountId });

    issues = issues.map((issue) => ({
      ...issue,
      assignedToEmail: accountEmailMakingRequest,
    }));

    const issuesCompleted = issues.filter((i) => i.completed);
    const issuesUncompleted = issues.filter((i) => !i.completed);

    const totalIssues = issuesUncompleted.length + issuesCompleted.length;
    const percentageCompleted =
      Math.ceil((issuesCompleted.length * 100) / totalIssues) || 0;

    return {
      percentageCompleted,
      leftUncompleted: issuesUncompleted.length,
      total: totalIssues,
      issues,
    };
  }

  async reportIssuesForToday({
    accountEmailMakingRequest,
  }: AccountMakingRequestDTO): Promise<IssuesForTodayMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    let issues = await connection("issue")
      .leftJoin("issue_group", "issue.issue_group_id", "=", "issue_group.id")
      .leftJoin("project", "issue_group.project_id", "=", "project.id")
      .select(
        "issue.id as issueId",
        "issue.title as title",
        "issue.description as description",
        "issue.created_at as createdAt",
        "issue.expires_at as expiresAt",
        "issue.completed as completed",
        "project.name as projectName"
      )
      .where({ assigned_to_account_id: accountId })
      .where("expires_at", ">=", startDate.toISOString())
      .where("expires_at", "<", endDate.toISOString());

    issues = issues.map((issue) => ({
      ...issue,
      assignedToEmail: accountEmailMakingRequest,
    }));

    const issuesCompleted = issues.filter((i) => i.completed);
    const issuesUncompleted = issues.filter((i) => !i.completed);

    const totalIssues = issuesUncompleted.length + issuesCompleted.length;
    const percentageCompleted =
      Math.ceil((issuesCompleted.length * 100) / totalIssues) || 0;

    return {
      percentageCompleted,
      issues: [...issuesUncompleted, ...issuesCompleted] as Issue &
        {
          projectName: string;
        }[],
    };
  }

  async reportExpiredIssues({
    accountEmailMakingRequest,
  }: AccountMakingRequestDTO): Promise<ExpiredIssuesMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    let issues = await connection("issue")
      .leftJoin("issue_group", "issue.issue_group_id", "=", "issue_group.id")
      .leftJoin("project", "issue_group.project_id", "=", "project.id")
      .select(
        "issue.id as issueId",
        "issue.title as title",
        "issue.description as description",
        "issue.created_at as createdAt",
        "issue.expires_at as expiresAt",
        "issue.completed as completed",
        "project.name as projectName"
      )
      .where({ assigned_to_account_id: accountId, completed: false })
      .where("expires_at", ">=", "1970-01-01T00:00:00.000Z")
      .where("expires_at", "<", new Date().toISOString());

    issues = issues.map((issue) => ({
      ...issue,
      assignedToEmail: accountEmailMakingRequest,
    }));

    return {
      amount: issues.length,
      issues: issues as Issue & { projectName: string }[],
    };
  }

  async findOneIssue(issueId: string): Promise<Issue | undefined> {
    const issue = await connection("issue")
      .select("*")
      .where({ id: issueId })
      .first();

    if (!issue) return undefined;

    return {
      issueId: issue.id,
      title: issue.title,
      description: issue.description,
      createdAt: issue.created_at,
      expiresAt: issue.expires_at,
    } as Issue;
  }

  async updateIssue({
    issueId,
    newTitle,
    newDescription,
    newExpiresAt,
    newCompleted,
    newAssignedToEmail,
  }: UpdateIssueRepositoryDTO): Promise<void> {
    let assignedToAccountId: string | undefined | null;
    if (newAssignedToEmail) {
      const account = await connection("account")
        .select("id")
        .where({ email: newAssignedToEmail })
        .first();
      assignedToAccountId = account ? account.id : undefined;
    } else if (newAssignedToEmail === null) {
      assignedToAccountId = null;
    }

    await connection("issue")
      .update({
        title: newTitle,
        description: newDescription,
        expires_at: newExpiresAt,
        completed: newCompleted,
        assigned_to_account_id: assignedToAccountId,
      })
      .where({ id: issueId });
  }

  async deleteIssue(issueId: string): Promise<void> {
    await connection("issue").where({ id: issueId }).del();
  }

  async doesIssueExist(issueId: string): Promise<boolean> {
    try {
      const issue = await connection("issue")
        .select("id")
        .where({ id: issueId })
        .first();

      return !!issue;
    } catch (err) {
      if (err.message.includes("invalid input syntax for type uuid"))
        return false;

      throw err;
    }
  }

  async createIssue({
    title,
    description,
    issueGroupId,
    issueId,
    createdAt,
    expiresAt,
  }: CreateIssueRepositoryDTO): Promise<void> {
    await connection("issue").insert({
      title,
      description,
      issue_group_id: issueGroupId,
      id: issueId,
      created_at: createdAt,
      expires_at: expiresAt,
    });
  }

  private async findAccountIdByEmail(
    email: string
  ): Promise<string | undefined> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();

    if (!account) return undefined;

    return account.id;
  }
}
