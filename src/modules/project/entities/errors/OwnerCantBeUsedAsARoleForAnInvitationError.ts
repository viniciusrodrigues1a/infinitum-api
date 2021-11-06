import { IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage } from "../interfaces/languages";

export class OwnerCantBeUsedAsARoleForAnInvitationError extends Error {
  constructor(language: IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage) {
    const message =
      language.getOwnerCantBeUsedAsARoleForAnInvitationErrorMessage();
    super(message);
    this.message = message;
  }
}
