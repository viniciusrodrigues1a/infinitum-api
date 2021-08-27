import { Email } from "./value-objects/Email";

export class Account {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = new Email(email).value;
  }
}
