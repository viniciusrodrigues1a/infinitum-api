export type IssueDTO = {
  title: string;
  description: string;
  ownerEmail: string;
  issueId?: string;
  createdAt?: Date;
  expiresAt?: Date;
  assignedToEmail?: string;
  completed?: boolean;
};
