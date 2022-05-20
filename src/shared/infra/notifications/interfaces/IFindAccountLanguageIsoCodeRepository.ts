export interface IFindAccountLanguageIsoCodeRepository {
  findIsoCode(email: string): Promise<string>;
}
