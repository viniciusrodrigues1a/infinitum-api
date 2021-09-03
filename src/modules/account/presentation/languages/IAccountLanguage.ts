import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import {
  IAccountNotFoundErrorLanguage,
  IEmailAlreadyInUseErrorLanguage,
} from "@modules/account/use-cases/interfaces/languages";
import { IInvalidCredentialsErrorLanguage } from "./IInvalidCredentialsErrorLanguage";

export interface IAccountLanguage
  extends IInvalidEmailErrorLanguage,
    IEmailAlreadyInUseErrorLanguage,
    IInvalidCredentialsErrorLanguage,
    IAccountNotFoundErrorLanguage {}
