import { ILanguage } from "./ILanguage";

export class PTBRLanguage implements ILanguage {
  getInvalidEmailErrorMessage(): string {
    return "Email não é válido";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email já está em uso";
  }
}
