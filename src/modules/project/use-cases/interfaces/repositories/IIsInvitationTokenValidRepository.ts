import { InvitationToken } from "@modules/project/entities/value-objects";

export interface IIsInvitationTokenValidRepository {
  isInvitationTokenValid(token: InvitationToken): Promise<boolean>;
}
