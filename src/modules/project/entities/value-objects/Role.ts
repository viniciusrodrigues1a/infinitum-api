import { IInvalidRoleNameErrorLanguage } from "../interfaces/languages";
import { Operation } from "./Operation";
import { permissions } from "./Permissions";
import { RoleName } from "./RoleName";
import { RoleNameType } from "./type-defs";

export class Role {
  name: RoleName;
  permissions: Operation[];

  constructor(
    name: string,
    invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage
  ) {
    this.name = new RoleName(name, invalidRoleNameErrorLanguage);
    this.permissions = permissions[name as RoleNameType];
  }

  can(operation: Operation): boolean {
    return this.permissions.indexOf(operation) !== -1;
  }
}
