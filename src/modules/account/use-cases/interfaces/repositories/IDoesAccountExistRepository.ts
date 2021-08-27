export interface IDoesAccountExistRepository {
  doesAccountExist(email: string): Promise<boolean>;
}
