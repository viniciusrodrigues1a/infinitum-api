import { IAccountHasAlreadyBeenInvitedErrorLanguage } from "../interfaces/languages";

export class AccountHasAlreadyBeenInvitedError extends Error {
  constructor(
    email: string,
    language: IAccountHasAlreadyBeenInvitedErrorLanguage
  ) {
    const message = language.getAccountHasAlreadyBeenInvitedErrorMessage(email);
    super(message);
    this.message = message;
  }
}
