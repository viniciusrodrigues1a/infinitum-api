import { Issue } from "@modules/issue/entities";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "@modules/issue/presentation/interfaces/languages";
import {
  AllIssuesMetrics,
  ExpiredIssuesMetrics,
  IFindAccountEmailAssignedToIssueRepository,
  IReportAllIssuesMetricsRepository,
  IReportExpiredIssuesMetricsRepository,
  IReportIssuesForTodayMetricsRepository,
  IReportIssuesMonthlyOverviewMetricsRepository,
  IReportIssuesWeeklyOverviewMetricsRepository,
  IssuesForTodayMetrics,
  IssuesMonthlyOverviewMetrics,
  IssuesWeeklyOverviewMetrics,
} from "@modules/issue/presentation/interfaces/repositories";
import { MetricsRepositoryDTO } from "@modules/issue/presentation/interfaces/repositories/MetricsRepositoryDTO";
import {
  AssignIssueToAccountRepositoryDTO,
  CreateIssueRepositoryDTO,
  MoveIssueToAnotherIssueGroupRepositoryDTO,
  UpdateIssueRepositoryDTO,
} from "@modules/issue/use-cases/DTOs";
import {
  IAssignIssueToAccountRepository,
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
import { IFindIssueTitleByIssueIdRepository } from "../notifications/interfaces/repositories";

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
    IMoveIssueToAnotherIssueGroupRepository,
    IReportIssuesMonthlyOverviewMetricsRepository,
    IAssignIssueToAccountRepository,
    IFindIssueTitleByIssueIdRepository,
    IFindAccountEmailAssignedToIssueRepository
{
  async findAccountEmailAssignedToIssue(
    issueId: string
  ): Promise<string | undefined> {
    const { assigned_to_account_id: accountId } = await connection("issue")
      .select("assigned_to_account_id")
      .where({ id: issueId })
      .first();

    if (!accountId) return undefined;

    const { email: accountEmail } = await connection("account")
      .select("email")
      .where({ id: accountId })
      .first();

    return accountEmail;
  }

  async findIssueTitle(issueId: string): Promise<string> {
    const { title } = await connection("issue")
      .select("title")
      .where({ id: issueId })
      .first();

    return title;
  }

  async assignIssueToAccount({
    issueId,
    assignedToEmail,
  }: AssignIssueToAccountRepositoryDTO): Promise<void> {
    let accountId: string | null = null;

    if (assignedToEmail) {
      const { id } = await connection("account")
        .select("id")
        .where({ email: assignedToEmail })
        .first();

      accountId = id;
    }

    await connection("issue")
      .update({
        assigned_to_account_id: accountId,
      })
      .where({ id: issueId });
  }

  async reportIssuesMonthlyOverview({
    accountEmailMakingRequest,
    date,
  }: MetricsRepositoryDTO): Promise<IssuesMonthlyOverviewMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    const monthDays: any[] = [];
    const startOfMonth = moment(date).startOf("month");
    const endOfMonth = moment(date).endOf("month");

    for (let i = 0; i < moment(date).daysInMonth(); i++) {
      const d = moment(startOfMonth).date(i + 1);

      monthDays.push({
        issuesCompleted: 0,
        date: d,
      });
    }

    const issues = await connection("issue")
      .select("*")
      .whereBetween("expires_at", [startOfMonth, endOfMonth])
      .andWhere({ assigned_to_account_id: accountId, completed: true });

    issues.forEach((issue) => {
      monthDays[moment(issue.expires_at).date() - 1].issuesCompleted += 1;
    });

    const formattedMonthlyOverview = monthDays.map((monthDay, index) => ({
      date: String(index + 1).padStart(2, "0"),
      value: monthDay.issuesCompleted,
    }));

    return formattedMonthlyOverview;
  }

  async moveIssue({
    issueId,
    moveToIssueGroupId,
    orderBefore,
    orderAfter,
  }: MoveIssueToAnotherIssueGroupRepositoryDTO): Promise<void> {
    const lastIssueGroup = await connection("issue")
      .select("*")
      .where({ issue_group_id: moveToIssueGroupId })
      .orderBy("order", "desc")
      .first();

    let order: BigInt | undefined;

    if (!lastIssueGroup) {
      order = BigInt(Number.MAX_SAFE_INTEGER) / BigInt(2);
    } else if (orderBefore && orderAfter) {
      const afterMinusBeforeDivided =
        (BigInt(orderAfter) - BigInt(orderBefore)) / BigInt(2);
      order = BigInt(orderAfter) - afterMinusBeforeDivided;
    } else if (orderBefore && !orderAfter) {
      order =
        BigInt(Number.MAX_SAFE_INTEGER) / BigInt(2) +
        BigInt(orderBefore) / BigInt(2);
    } else if (orderAfter && !orderBefore) {
      order = BigInt(orderAfter) / BigInt(2);
    }

    await connection("issue")
      .where({
        id: issueId,
      })
      .update({
        issue_group_id: moveToIssueGroupId,
        order: order ? order.toString() : order,
      });
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
    { accountEmailMakingRequest, date }: MetricsRepositoryDTO,
    issuesWeeklyOverviewWeekdaysLanguage: IIssuesWeeklyOverviewWeekdaysLanguage
  ): Promise<IssuesWeeklyOverviewMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    const completed = [0, 0, 0, 0, 0, 0, 0, 0];

    const monday = moment(date).weekday(1).format("YYYY-MM-DD");
    const sunday = moment(date).weekday(7).format("YYYY-MM-DD");

    const issues = await connection("issue")
      .select("*")
      .whereBetween("expires_at", [monday, sunday])
      .andWhere({ assigned_to_account_id: accountId, completed: true });

    issues.forEach((issue) => {
      const expiresAt = moment(issue.expires_at);
      completed[expiresAt.day() - 1] += 1;
    });

    const lang =
      issuesWeeklyOverviewWeekdaysLanguage.getIssuesWeeklyOverviewWeekdays();
    const formattedWeekOverview: IssuesWeeklyOverviewMetrics = [
      { date: lang[0], value: completed[6] },
      { date: lang[1], value: completed[0] },
      { date: lang[2], value: completed[1] },
      { date: lang[3], value: completed[2] },
      { date: lang[4], value: completed[3] },
      { date: lang[5], value: completed[4] },
      { date: lang[6], value: completed[5] },
    ];

    return formattedWeekOverview;
  }

  async reportAllIssues({
    accountEmailMakingRequest,
  }: MetricsRepositoryDTO): Promise<AllIssuesMetrics> {
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
    date,
  }: MetricsRepositoryDTO): Promise<IssuesForTodayMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    const formattedDate = moment(date).format("YYYY-MM-DD");

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
      .where("expires_at", "=", formattedDate);

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
    date,
  }: MetricsRepositoryDTO): Promise<ExpiredIssuesMetrics> {
    const accountId = await this.findAccountIdByEmail(
      accountEmailMakingRequest
    );

    const formattedDate = moment(date).format("YYYY-MM-DD");

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
      .andWhere("expires_at", "<", formattedDate);

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
  }: UpdateIssueRepositoryDTO): Promise<void> {
    await connection("issue")
      .update({
        title: newTitle,
        description: newDescription,
        expires_at: newExpiresAt,
        completed: newCompleted,
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
    // Arbitrarily ordering issues
    // https://dba.stackexchange.com/questions/36875/arbitrarily-ordering-records-in-a-table

    const lastIssueGroup = await connection("issue")
      .select("*")
      .where({ issue_group_id: issueGroupId })
      .orderBy("order", "desc")
      .first();

    const BIGINT_MAX_VALUE = BigInt(Number.MAX_SAFE_INTEGER);

    if (!lastIssueGroup) {
      await connection("issue").insert({
        title,
        description,
        issue_group_id: issueGroupId,
        id: issueId,
        created_at: createdAt,
        expires_at: expiresAt,
        order: (BIGINT_MAX_VALUE / BigInt(2)).toString(),
      });
    } else {
      const order =
        BIGINT_MAX_VALUE / BigInt(2) + BigInt(lastIssueGroup.order) / BigInt(2);
      await connection("issue").insert({
        title,
        description,
        issue_group_id: issueGroupId,
        id: issueId,
        created_at: createdAt,
        expires_at: expiresAt,
        order: order.toString(),
      });
    }
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
