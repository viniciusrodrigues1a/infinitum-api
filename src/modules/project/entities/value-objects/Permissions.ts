import { PermissionsType } from "./type-defs";

export const permissions: PermissionsType = {
  espectator: [],
  member: [
    "CREATE_ISSUE_GROUP",
    "CREATE_ISSUE",
    "DELETE_ISSUE",
    "UPDATE_ISSUE",
  ],
  admin: [
    "UPDATE_PROJECT",
    "CREATE_ISSUE_GROUP",
    "CREATE_ISSUE",
    "DELETE_ISSUE",
    "UPDATE_ISSUE",
  ],
  owner: [
    "DELETE_PROJECT",
    "UPDATE_PROJECT",
    "CREATE_ISSUE_GROUP",
    "CREATE_ISSUE",
    "DELETE_ISSUE",
    "UPDATE_ISSUE",
    "INVITE_ACCOUNT_TO_PROJECT",
  ],
};
