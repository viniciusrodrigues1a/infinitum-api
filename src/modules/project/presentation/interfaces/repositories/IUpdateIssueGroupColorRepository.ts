export type UpdateIssueGroupColorRepositoryDTO = {
  issueGroupId: string;
  newColor: string;
};

export interface IUpdateIssueGroupColorRepository {
  updateIssueGroupColor(
    data: UpdateIssueGroupColorRepositoryDTO
  ): Promise<void>;
}
