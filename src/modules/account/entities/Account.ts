import { IInvalidEmailErrorLanguage } from "./interfaces/languages";
import { Email } from "./value-objects/Email";

export class Account {
  name: string;
  email: string;

  constructor(
    name: string,
    email: string,
    invalidEmailErrorLanguage: IInvalidEmailErrorLanguage
  ) {
    this.name = name;
    this.email = new Email(email, invalidEmailErrorLanguage).value;
    Object.freeze(this);
  }
}
