import { Role } from "../value-objects";

export type InvitationDTO = {
  projectId: string;
  accountEmail: string;
  role: Role;
};
