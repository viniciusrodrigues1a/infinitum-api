import { IAccountLanguage } from "./IAccountLanguage";

export class PTBRLanguage implements IAccountLanguage {
  getInvalidCredentialsErrorMessage(): string {
    return "Email ou senha inválidos";
  }

  getAccountNotFoundErrorMessage(_identifier: string): string {
    return "Conta especificada não existe";
  }

  getInvalidEmailErrorMessage(): string {
    return "Email não é válido";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email já está em uso";
  }
}
