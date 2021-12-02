export type UpdateIssueGroupFinalStatusRepository = {
  issueGroupId: string;
  newIsFinal: boolean;
};

export interface IUpdateIssueGroupFinalStatusRepository {
  updateIssueGroupFinalStatus(
    data: UpdateIssueGroupFinalStatusRepository
  ): Promise<void>;
}
