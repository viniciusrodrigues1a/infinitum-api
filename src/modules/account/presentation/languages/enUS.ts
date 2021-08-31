import { IAccountLanguage } from "./IAccountLanguage";

export class ENUSLanguage implements IAccountLanguage {
  getInvalidEmailErrorMessage(): string {
    return "Email is not valid";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email is already in use";
  }
}
