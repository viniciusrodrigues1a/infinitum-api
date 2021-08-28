import { CreateAccountController } from "@modules/account/presentation/controllers";

export interface IControllerFactory {
  makeCreateAccountController(): CreateAccountController;
}
