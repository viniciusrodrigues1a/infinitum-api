import { IAccountLanguage } from "./IAccountLanguage";

export class PTBRLanguage implements IAccountLanguage {
  getAccountNotFoundErrorMessage(_identifier: string): string {
    return "Conta especificada não existe";
  }
  getInvalidPasswordErrorMessage(): string {
    return "Email ou senha inválidos";
  }

  getInvalidEmailErrorMessage(): string {
    return "Email não é válido";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email já está em uso";
  }
}
