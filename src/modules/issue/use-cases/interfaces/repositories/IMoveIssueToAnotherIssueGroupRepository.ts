import { MoveIssueToAnotherIssueGroupRepositoryDTO } from "../../DTOs";

export interface IMoveIssueToAnotherIssueGroupRepository {
  moveIssue(data: MoveIssueToAnotherIssueGroupRepositoryDTO): Promise<void>;
}
