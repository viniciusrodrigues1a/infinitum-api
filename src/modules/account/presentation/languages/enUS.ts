import { IAccountLanguage } from "./IAccountLanguage";

export class ENUSLanguage implements IAccountLanguage {
  getInvalidPasswordErrorMessage(): string {
    return "Invalid email or password";
  }

  getInvalidEmailErrorMessage(): string {
    return "Email is not valid";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email is already in use";
  }
}
