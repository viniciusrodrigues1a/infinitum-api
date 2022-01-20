export type UpdateIssueGroupFinalStatusRepositoryDTO = {
  issueGroupId: string;
  newIsFinal: boolean;
};

export interface IUpdateIssueGroupFinalStatusRepository {
  updateIssueGroupFinalStatus(
    data: UpdateIssueGroupFinalStatusRepositoryDTO
  ): Promise<void>;
}
