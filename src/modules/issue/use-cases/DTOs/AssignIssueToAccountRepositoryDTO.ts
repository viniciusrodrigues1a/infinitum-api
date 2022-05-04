import { AssignIssueToAccountUseCaseDTO } from "./AssignIssueToAccountUseCaseDTO";

export type AssignIssueToAccountRepositoryDTO = Omit<
  AssignIssueToAccountUseCaseDTO,
  "accountEmailMakingRequest"
>;
