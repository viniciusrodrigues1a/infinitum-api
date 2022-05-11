export interface IFindOneProjectIdByInvitationTokenRepository {
  findOneProjectIdByToken(token: string): Promise<string | undefined>;
}
