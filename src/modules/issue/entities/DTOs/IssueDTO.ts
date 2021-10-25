import { Account } from "@modules/account/entities/Account";

export type IssueDTO = {
  title: string;
  description: string;
  issueId?: string;
  createdAt?: Date;
  expiresAt?: Date;
  owner: Account;
  assignedTo: Account;
};
