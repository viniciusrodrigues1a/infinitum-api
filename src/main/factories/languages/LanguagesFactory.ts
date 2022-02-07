import {
  ENUSLanguage,
  ILanguage,
  PTBRLanguage,
} from "@shared/presentation/languages";
import {
  ENUSAuthorizationMiddlewareLanguage,
  PTBRAuthorizationMiddlewareLanguage,
} from "@main/languages";
import { ptBR, enUS } from "date-fns/locale";
import { DateFnsDateProvider } from "@shared/infra/providers/DateFnsDateProvider";

const classToObject = (theClass: any) => {
  const originalClass = theClass || {};
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));
  return keys.reduce((classAsObj, key) => {
    (classAsObj as any)[key] = originalClass[key];
    return classAsObj;
  }, {});
};

class LanguagesFactory {
  makePTBRLanguage(): ILanguage {
    const domainLanguage = new PTBRLanguage(new DateFnsDateProvider(ptBR));
    const authorizationMiddlewareLanguage =
      new PTBRAuthorizationMiddlewareLanguage();

    const authLanguageObject = classToObject(authorizationMiddlewareLanguage);
    const merged = Object.assign(
      Object.create(Object.getPrototypeOf(domainLanguage)),
      domainLanguage,
      authLanguageObject
    );

    return merged;
  }

  makeENUSLanguage(): ILanguage {
    const domainLanguage = new ENUSLanguage(new DateFnsDateProvider(enUS));
    const authorizationMiddlewareLanguage =
      new ENUSAuthorizationMiddlewareLanguage();

    const authLanguageObject = classToObject(authorizationMiddlewareLanguage);
    const merged = Object.assign(
      Object.create(Object.getPrototypeOf(domainLanguage)),
      domainLanguage,
      authLanguageObject
    );

    return merged;
  }
}

export const languagesFactory = new LanguagesFactory();
