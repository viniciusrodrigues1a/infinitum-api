export type Language = {
  id: string;
  isoCode: string;
  displayName: string;
};

export interface IListLanguagesRepository {
  listLanguages(): Promise<Language[]>;
}
