import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { FutureDate, Id } from "@shared/entities/value-objects";
import { ProjectDTO } from "./DTOs";
import { BeginsAtMustBeBeforeFinishesAtError } from "./errors";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "./interfaces/languages";
import { Participant } from "./value-objects";

export class Project {
  projectId: string;
  name: string;
  description: string;
  createdAt: Date;
  beginsAt: Date | undefined;
  finishesAt: Date | undefined;
  participants: Participant[];
  issues: []; // TODO create Issue entity

  constructor(
    {
      name,
      description,
      beginsAt,
      finishesAt,
      participants,
      issues,
    }: ProjectDTO,
    notFutureDateErrorLanguage: INotFutureDateErrorLanguage,
    beginsAtMustBeBeforeFinishesAtErrorLanguage: IBeginsAtMustBeBeforeFinishesAtErrorLanguage
  ) {
    this.projectId = new Id().value;
    this.name = name;
    this.description = description;
    this.createdAt = new Date();

    this.beginsAt = beginsAt;
    this.finishesAt = finishesAt
      ? new FutureDate(finishesAt, notFutureDateErrorLanguage).value
      : undefined;
    this.participants = participants || [];
    this.issues = issues || [];

    if (!this.isBeginsAtBeforeFinishesAt()) {
      throw new BeginsAtMustBeBeforeFinishesAtError(
        beginsAtMustBeBeforeFinishesAtErrorLanguage
      );
    }

    Object.freeze(this);
  }

  private isBeginsAtBeforeFinishesAt(): boolean {
    if (
      typeof this.beginsAt === "undefined" ||
      typeof this.finishesAt === "undefined"
    )
      return true;

    const beginsAtMs = this.beginsAt.getTime();
    const finishesAtMs = this.finishesAt.getTime();
    const difference = finishesAtMs - beginsAtMs;

    return difference > 0;
  }
}
