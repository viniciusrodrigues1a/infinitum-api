import { CreateIssueRepositoryDTO } from "../DTOs";

export interface ICreateIssueRepository {
  createIssue(data: CreateIssueRepositoryDTO): Promise<void>;
}
