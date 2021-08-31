import { CreateAccountController } from "@modules/account/presentation/controllers";
import { ILanguage } from "../../adapters/utils";

export interface IControllerFactory {
  makeCreateAccountController(language: ILanguage): CreateAccountController;
}
