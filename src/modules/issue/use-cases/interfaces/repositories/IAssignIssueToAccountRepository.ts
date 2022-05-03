import { AssignIssueToAccountRepositoryDTO } from "../../DTOs";

export interface IAssignIssueToAccountRepository {
  assignIssueToAccount(data: AssignIssueToAccountRepositoryDTO): Promise<void>;
}
