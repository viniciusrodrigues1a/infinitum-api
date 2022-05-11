import { PermissionsType } from "./type-defs";

export const permissions: PermissionsType = {
  espectator: [],
  member: [
    "CREATE_ISSUE_GROUP",
    "CREATE_ISSUE",
    "DELETE_ISSUE",
    "UPDATE_ISSUE",
    "MOVE_ISSUE",
  ],
  admin: [
    "UPDATE_PROJECT",
    "CREATE_ISSUE_GROUP",
    "CREATE_ISSUE",
    "DELETE_ISSUE",
    "UPDATE_ISSUE",
    "KICK_ACCOUNT_FROM_PROJECT",
    "MOVE_ISSUE",
    "ASSIGN_ISSUE_TO_ACCOUNT",
    "LIST_INVITED_PARTICIPANTS",
  ],
  owner: [
    "DELETE_PROJECT",
    "UPDATE_PROJECT",
    "CREATE_ISSUE_GROUP",
    "CREATE_ISSUE",
    "DELETE_ISSUE",
    "UPDATE_ISSUE",
    "INVITE_ACCOUNT_TO_PROJECT",
    "KICK_ACCOUNT_FROM_PROJECT",
    "REVOKE_INVITATION",
    "UPDATE_PARTICIPANT_ROLE",
    "MOVE_ISSUE",
    "ASSIGN_ISSUE_TO_ACCOUNT",
    "LIST_INVITED_PARTICIPANTS",
    "DELETE_ISSUE_GROUP",
  ],
};
