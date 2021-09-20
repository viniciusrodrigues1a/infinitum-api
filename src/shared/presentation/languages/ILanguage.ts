import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages/IInvalidCredentialsErrorLanguage";
import {
  IAccountNotFoundErrorLanguage,
  IEmailAlreadyInUseErrorLanguage,
} from "@modules/account/use-cases/interfaces/languages";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "@modules/project/entities/interfaces/languages";
import { ICreateProjectControllerLanguage } from "@modules/project/presentation/controllers/interfaces/languages";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import { IMissingParamsErrorLanguage } from "../interfaces/languages";

export interface ILanguage
  extends IInvalidEmailErrorLanguage,
    IEmailAlreadyInUseErrorLanguage,
    IInvalidCredentialsErrorLanguage,
    IAccountNotFoundErrorLanguage,
    INotFutureDateErrorLanguage,
    ICreateProjectControllerLanguage,
    IMissingParamsErrorLanguage,
    IBeginsAtMustBeBeforeFinishesAtErrorLanguage {}
