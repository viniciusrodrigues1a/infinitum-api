export interface IFindAccountLanguageIdRepository {
  findAccountLanguage(email: string): Promise<string | null>;
}
