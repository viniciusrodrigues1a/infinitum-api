export interface IFindAccountImageDataURLRepository {
  findAccountImageDataURL(email: string): Promise<string | undefined>;
}
