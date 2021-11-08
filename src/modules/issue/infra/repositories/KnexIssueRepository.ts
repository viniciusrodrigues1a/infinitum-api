import { Issue } from "@modules/issue/entities";
import {
  CreateIssueRepositoryDTO,
  UpdateIssueRepositoryDTO,
} from "@modules/issue/use-cases/DTOs";
import {
  ICreateIssueRepository,
  IDeleteIssueRepository,
  IDoesIssueExistRepository,
  IFindOneIssueRepository,
  IUpdateIssueRepository,
} from "@modules/issue/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";

export class KnexIssueRepository
  implements
    ICreateIssueRepository,
    IDoesIssueExistRepository,
    IDeleteIssueRepository,
    IUpdateIssueRepository,
    IFindOneIssueRepository
{
  async findOneIssue(issueId: string): Promise<Issue | undefined> {
    const issue = await connection("issue")
      .select("*")
      .where({ id: issueId })
      .first();

    if (!issue) return undefined;

    const { email: ownerEmail } = await connection("account")
      .select("email")
      .where({ id: issue.owner_id })
      .first();

    return {
      issueId: issue.id,
      title: issue.title,
      description: issue.description,
      ownerEmail,
      createdAt: issue.created_at,
      expiresAt: issue.expires_at,
    } as Issue;
  }

  async updateIssue({
    issueId,
    newTitle,
    newDescription,
    newExpiresAt,
  }: UpdateIssueRepositoryDTO): Promise<void> {
    await connection("issue")
      .update({
        title: newTitle,
        description: newDescription,
        newExpiresAt,
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
    ownerEmail,
    issueGroupId,
    issueId,
    createdAt,
    expiresAt,
  }: CreateIssueRepositoryDTO): Promise<void> {
    const { id: ownerId } = await connection("account")
      .select("*")
      .where({ email: ownerEmail })
      .first();

    await connection("issue").insert({
      title,
      description,
      issue_group_id: issueGroupId,
      owner_id: ownerId,
      id: issueId,
      created_at: createdAt,
      expires_at: expiresAt,
    });
  }
}
