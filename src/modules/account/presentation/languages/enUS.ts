import { IAccountLanguage } from "./IAccountLanguage";

export class ENUSLanguage implements IAccountLanguage {
  getAccountNotFoundErrorMessage(_identifier: string): string {
    return "Account couldn't be found";
  }

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
