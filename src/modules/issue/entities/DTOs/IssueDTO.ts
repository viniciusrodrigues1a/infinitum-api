import { Account } from "@modules/account/entities/Account";

export type IssueDTO = {
  title: string;
  description: string;
  owner: Account;
  issueId?: string;
  createdAt?: Date;
  expiresAt?: Date;
  assignedTo?: Account;
};
