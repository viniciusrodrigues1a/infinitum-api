import { Operation } from "./Operation";
import { RoleNameType } from "./type-defs";

export type Role = {
  name: RoleNameType;
  permissions: Operation[];
};
