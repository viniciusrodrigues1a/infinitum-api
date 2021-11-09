import { IInvalidInvitationTokenErrorLanguage } from "../interfaces/languages";

export class InvalidInvitationTokenError extends Error {
  constructor(language: IInvalidInvitationTokenErrorLanguage) {
    const message = language.getInvalidInvitationTokenErrorMessage();
    super(message);
    this.message = message;
  }
}
