import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { IEmailAlreadyInUseErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IInvalidPasswordErrorLanguage } from "./IInvalidPasswordErrorLanguage";

export interface IAccountLanguage
  extends IInvalidEmailErrorLanguage,
    IEmailAlreadyInUseErrorLanguage,
    IInvalidPasswordErrorLanguage {}
