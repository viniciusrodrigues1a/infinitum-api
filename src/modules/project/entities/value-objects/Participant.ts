import { Account } from "@modules/account/entities/Account";
import { Role } from "./Role";

export class Participant {
  account: Account;
  role: Role;

  constructor(account: Account, role: Role) {
    this.account = account;
    this.role = role;
  }
}
