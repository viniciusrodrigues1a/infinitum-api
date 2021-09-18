import { InvalidRoleNameError } from "../errors/InvalidRoleNameError";
import { IInvalidRoleNameErrorLanguage } from "../interfaces/languages";
import { RoleNameType } from "./type-defs";

export class RoleName {
  value: RoleNameType;

  constructor(
    name: string,
    invalidRoleNameErrorLanguage: IInvalidRoleNameErrorLanguage
  ) {
    const roleNames = ["espectator", "member", "admin", "owner"];

    if (!roleNames.some((r) => r === name)) {
      throw new InvalidRoleNameError(name, invalidRoleNameErrorLanguage);
    }

    this.value = name as RoleNameType;
  }
}
