import { CreateIssueRepositoryDTO } from "@modules/issue/use-cases/DTOs";
import {
  ICreateIssueRepository,
  IDeleteIssueRepository,
  IDoesIssueExistRepository,
} from "@modules/issue/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";

export class KnexIssueRepository
  implements
    ICreateIssueRepository,
    IDoesIssueExistRepository,
    IDeleteIssueRepository
{
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
