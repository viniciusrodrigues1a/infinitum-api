import { InvitationToken } from "@modules/project/entities/value-objects";

export interface IFindOneAccountEmailByInvitationTokenRepository {
  findOneAccountEmailByInvitationToken(token: InvitationToken): Promise<string>;
}
