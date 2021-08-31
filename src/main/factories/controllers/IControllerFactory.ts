import { CreateAccountController } from "@modules/account/presentation/controllers";
import { ILanguage } from "@modules/account/presentation/languages/ILanguage";

export interface IControllerFactory {
  makeCreateAccountController(language: ILanguage): CreateAccountController;
}
