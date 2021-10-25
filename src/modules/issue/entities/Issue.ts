import { Account } from "@modules/account/entities/Account";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { FutureDate, Id } from "@shared/entities/value-objects";
import { IssueDTO } from "./DTOs";

export class Issue {
  issueId: string;
  title: string;
  description: string;
  createdAt: Date;
  expiresAt: Date | undefined;
  owner: Account;
  assignedTo: Account;

  constructor(
    {
      title,
      description,
      owner,
      assignedTo,
      issueId,
      expiresAt,
      createdAt,
    }: IssueDTO,
    notFutureDateErrorLanguage: INotFutureDateErrorLanguage
  ) {
    this.issueId = issueId || new Id().value;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt || new Date();
    this.expiresAt = expiresAt
      ? new FutureDate(expiresAt, notFutureDateErrorLanguage).value
      : undefined;
    this.owner = owner;
    this.assignedTo = assignedTo;
  }
}
