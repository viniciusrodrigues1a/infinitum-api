import { Account } from "@modules/account/entities/Account";
import { Operation } from "./Operation";
import { Role } from "./Role";

export class Participant {
  account: Account;
  role: Role;

  constructor(account: Account, role: Role) {
    this.account = account;
    this.role = role;
  }

  can(operation: Operation): boolean {
    return this.role.permissions.indexOf(operation) !== -1;
  }
}
