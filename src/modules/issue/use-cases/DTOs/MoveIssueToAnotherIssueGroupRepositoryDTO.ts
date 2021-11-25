import { MoveIssueToAnotherIssueGroupUseCaseDTO } from "./MoveIssueToAnotherIssueGroupUseCaseDTO";

export type MoveIssueToAnotherIssueGroupRepositoryDTO = Omit<
  MoveIssueToAnotherIssueGroupUseCaseDTO,
  "accountEmailMakingRequest"
>;
