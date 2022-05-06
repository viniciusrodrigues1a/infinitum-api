import { Account } from "@modules/account/entities/Account";

export interface IListParticipantsInvitedToProjectRepository {
  listParticipants(projectId: string): Promise<Account[]>;
}
