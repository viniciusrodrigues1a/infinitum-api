export type IssueDTO = {
  title: string;
  description?: string;
  issueId?: string;
  createdAt?: Date;
  expiresAt?: Date | null;
  assignedToEmail?: string;
  completed?: boolean;
};
