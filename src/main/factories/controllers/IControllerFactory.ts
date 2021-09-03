import { RegisterController } from "@modules/account/presentation/controllers/RegisterController";
import { ILanguage } from "../../adapters/utils";

export interface IControllerFactory {
  makeRegisterController(language: ILanguage): RegisterController;
}
