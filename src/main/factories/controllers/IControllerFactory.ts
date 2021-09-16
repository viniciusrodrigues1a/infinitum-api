import { FindOneAccountController } from "@modules/account/presentation/controllers/FindOneAccountController";
import { LoginController } from "@modules/account/presentation/controllers/LoginController";
import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { ILanguage } from "../../adapters/utils";

export interface IControllerFactory {
  makeRegisterController(language: ILanguage): RegisterController;
  makeLoginController(language: ILanguage): LoginController;
  makeFindOneAccountController(language: ILanguage): FindOneAccountController;
}
