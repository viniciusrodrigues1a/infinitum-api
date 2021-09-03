import { IAccountLanguage } from "./IAccountLanguage";

export class ENUSLanguage implements IAccountLanguage {
  getInvalidCredentialsErrorMessage(): string {
    return "Invalid email or password";
  }

  getAccountNotFoundErrorMessage(_identifier: string): string {
    return "Account couldn't be found";
  }

  getInvalidEmailErrorMessage(): string {
    return "Email is not valid";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email is already in use";
  }
}
