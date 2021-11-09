import { InvitationToken } from "@modules/project/entities/value-objects";

export interface IAcceptInvitationTokenRepository {
  acceptInvitationToken(token: InvitationToken): Promise<void>;
}
