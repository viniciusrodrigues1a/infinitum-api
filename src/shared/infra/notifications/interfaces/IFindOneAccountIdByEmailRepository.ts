export interface IFindOneAccountIdByEmailRepository {
  findOneAccountIdByEmail(email: string): Promise<string | undefined>;
}
