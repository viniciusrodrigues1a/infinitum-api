import { CreateIssueRepositoryDTO } from "@modules/issue/use-cases/DTOs";
import { ICreateIssueRepository } from "@modules/issue/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";

export class KnexIssueRepository implements ICreateIssueRepository {
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
