import { IssueGroup, Participant } from "../value-objects";

export type ProjectDTO = {
  name: string;
  description: string;
  projectId?: string;
  beginsAt?: Date;
  finishesAt?: Date;
  participants?: Participant[];
  issueGroups?: IssueGroup[];
};
