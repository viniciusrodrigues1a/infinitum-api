import { UpdateIssueUseCaseDTO } from "./UpdateIssueUseCaseDTO";

export type UpdateIssueRepositoryDTO = Omit<
  UpdateIssueUseCaseDTO,
  "accountEmailMakingRequest" | "newAssignedToEmail"
> & {
  newAssignedToEmail?: string | false;
};
