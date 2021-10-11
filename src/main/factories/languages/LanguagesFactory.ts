import { ILanguage } from "@shared/presentation/languages/ILanguage";
import { PTBRLanguage } from "@shared/presentation/languages/ptBR";
import { ENUSLanguage } from "@shared/presentation/languages/enUS";
import {
  ENUSAuthorizationMiddlewareLanguage,
  PTBRAuthorizationMiddlewareLanguage,
} from "@main/languages";

function mergeTwoClassInstances(obj1: any, obj2: any): any {
  const merged: any = {};

  const objs = [obj1, obj2];
  for (let i = 0; i < objs.length; i++) {
    const objPrototype = Object.getPrototypeOf(objs[i]);
    const objKeys = Object.getOwnPropertyNames(objPrototype);
    for (let j = 0; j < objKeys.length; j++) {
      const key = objKeys[j];
      const value = objPrototype[key];
      if (typeof value === "function" && key !== "constructor") {
        merged[key] = value;
      }
    }
  }

  return merged;
}

class LanguagesFactory {
  makePTBRLanguage(): ILanguage {
    const domainLanguage = new PTBRLanguage();
    const authorizationMiddlewareLanguage =
      new PTBRAuthorizationMiddlewareLanguage();

    const merged = mergeTwoClassInstances(
      domainLanguage,
      authorizationMiddlewareLanguage
    );

    return merged;
  }

  makeENUSLanguage(): ILanguage {
    const domainLanguage = new ENUSLanguage();
    const authorizationMiddlewareLanguage =
      new ENUSAuthorizationMiddlewareLanguage();

    return mergeTwoClassInstances(
      domainLanguage,
      authorizationMiddlewareLanguage
    );
  }
}

export const languagesFactory = new LanguagesFactory();
