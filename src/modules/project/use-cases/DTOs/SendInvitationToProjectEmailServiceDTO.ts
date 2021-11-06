import { InvitationToken } from "@modules/project/entities/value-objects";

export type SendInvitationToProjectEmailServiceDTO = {
  projectName: string;
  token: InvitationToken;
};
