import { InvalidEmailError } from "../errors";
import { IInvalidEmailErrorLanguage } from "../interfaces/languages";

export class Email {
  value: string;

  constructor(email: string, language: IInvalidEmailErrorLanguage) {
    if (!this.isEmailValid(email)) {
      throw new InvalidEmailError(language);
    }

    this.value = email;
    Object.freeze(this);
  }

  private isEmailValid(email: string): boolean {
    const regexp =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email || email.length > 256 || !regexp.test(email)) return false;

    const emailSplitted = email.split("@");

    const username = emailSplitted[0];
    if (username.length > 64) return false;

    const address = emailSplitted[1];
    const domain = address.split(".");
    if (domain.some((partOfDomain) => partOfDomain.length > 63)) return false;

    return true;
  }
}
