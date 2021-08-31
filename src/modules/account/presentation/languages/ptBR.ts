import { IAccountLanguage } from "./IAccountLanguage";

export class PTBRLanguage implements IAccountLanguage {
  getInvalidEmailErrorMessage(): string {
    return "Email não é válido";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email já está em uso";
  }
}
