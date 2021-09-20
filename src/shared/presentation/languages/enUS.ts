import { ILanguage } from "./ILanguage";

export class ENUSLanguage implements ILanguage {
  getMissingParamsErrorNameParamMessage(): string {
    return "name";
  }

  getMissingParamsErrorDescriptionParamMessage(): string {
    return "description";
  }

  getMissingParamsErrorMessage(params: string[]): string {
    return `You need to specify: ${params.join(", ")}`;
  }

  getNotFutureDateErrorMessage(date: Date): string {
    return `Date ${date.toLocaleString()} can't be in the past`;
  }

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
