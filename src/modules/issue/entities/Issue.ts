import { Id } from "@shared/entities/value-objects";
import { IssueDTO } from "./DTOs";

export class Issue {
  issueId: string;
  title: string;
  description: string | undefined;
  createdAt: Date;
  expiresAt: Date | undefined | null;
  assignedToEmail: string | undefined;
  completed: boolean;
  order?: string;

  constructor({
    title,
    description,
    assignedToEmail,
    issueId,
    expiresAt,
    createdAt,
    completed,
  }: IssueDTO) {
    this.issueId = issueId || new Id().value;
    this.title = title;
    this.description = description || undefined;
    this.createdAt = createdAt || new Date();
    this.assignedToEmail = assignedToEmail || null!;
    this.completed = completed || false;
    if (expiresAt === null) this.expiresAt = null;
    if (expiresAt === undefined) this.expiresAt = undefined;
    if (expiresAt) this.expiresAt = new Date(expiresAt);
  }
}
