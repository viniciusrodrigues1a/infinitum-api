import { Participant } from "../value-objects/Participant";

export type ProjectDTO = {
  name: string;
  description: string;
  beginsAt?: Date;
  finishesAt?: Date;
  participants?: Participant[];
  issues?: [];
};
