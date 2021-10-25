import { CreateIssueGroupForProjectRepositoryDTO } from "../../DTOs";

export interface ICreateIssueGroupForProjectRepository {
  createIssueGroup(
    data: CreateIssueGroupForProjectRepositoryDTO
  ): Promise<void>;
}
