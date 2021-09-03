import { IAccountLanguage } from "./IAccountLanguage";

export class PTBRLanguage implements IAccountLanguage {
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
