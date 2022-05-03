import { UpdateIssueUseCaseDTO } from "./UpdateIssueUseCaseDTO";

export type UpdateIssueRepositoryDTO = Omit<
  UpdateIssueUseCaseDTO,
  "accountEmailMakingRequest"
>;
