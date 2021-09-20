/* eslint-disable no-restricted-syntax  */

import { ILanguage } from "@modules/account/presentation/languages";
import { languagesFactory } from "../../factories/languages/LanguagesFactory";

type ParsedAcceptLanguage = { tag: string; weight: number };

type Languages = {
  [key: string]: ILanguage;
};

type LanguageMatch = { tag: string; language: ILanguage };

const ptBR = languagesFactory.makePTBRLanguage();
const enUS = languagesFactory.makeENUSLanguage();

class AcceptLanguageHeaderUtil {
  private languages: Languages = {
    "pt-br": ptBR,
    pt: ptBR,
    "en-us": enUS,
    en: enUS,
  };

  public parseAcceptLanguage(
    header: string | undefined
  ): ParsedAcceptLanguage[] {
    if (!header) return [{ tag: "pt-BR", weight: 1 }]; // if no header is specified, ignore Accept-Language

    const parsed = [];

    const pairs = header.split(",");
    for (const pair of pairs) {
      const [languageTag, qValue] = pair.split(";");
      const tag = languageTag.trim();
      const weight = this.getWeightOfQValue(qValue);
      parsed.push({ tag, weight });
    }

    return parsed;
  }

  public findBestMatchingLanguage(
    parsedHeader: ParsedAcceptLanguage[]
  ): LanguageMatch {
    const copy = [...parsedHeader];
    const sortedLanguages = copy.sort((a, b) => b.weight - a.weight);

    for (const lang of sortedLanguages) {
      const languageFound = this.languages[lang.tag.toLowerCase()];
      if (languageFound) return { tag: lang.tag, language: languageFound };
    }

    return { tag: "pt-BR", language: this.languages["pt-br"] };
  }

  private getWeightOfQValue(qValue: string): number {
    if (!qValue) {
      return 1;
    }
    const [, weightString] = qValue.split("=");
    return Number(weightString);
  }
}

export const acceptLanguageHeaderUtil = new AcceptLanguageHeaderUtil();
