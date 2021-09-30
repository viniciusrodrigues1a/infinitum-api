import { Operation } from "../Operation";
import { RoleNameType } from "./RoleNameType";

export type PermissionsType = {
  [key in RoleNameType]: Operation[];
};
