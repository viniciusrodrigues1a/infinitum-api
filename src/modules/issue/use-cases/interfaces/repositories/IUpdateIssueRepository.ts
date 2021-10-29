import { UpdateIssueRepositoryDTO } from "../../DTOs";

export interface IUpdateIssueRepository {
  updateIssue(data: UpdateIssueRepositoryDTO): Promise<void>;
}
