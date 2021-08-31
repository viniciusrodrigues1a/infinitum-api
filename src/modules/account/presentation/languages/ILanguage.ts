import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { IEmailAlreadyInUseErrorLanguage } from "@modules/account/use-cases/interfaces/languages";

export interface ILanguage
  extends IInvalidEmailErrorLanguage,
    IEmailAlreadyInUseErrorLanguage {}
