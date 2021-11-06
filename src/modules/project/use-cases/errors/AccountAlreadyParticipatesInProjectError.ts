import { IAccountAlreadyParticipatesInProjectErrorLanguage } from "../interfaces/languages";

export class AccountAlreadyParticipatesInProjectError extends Error {
  constructor(
    email: string,
    language: IAccountAlreadyParticipatesInProjectErrorLanguage
  ) {
    const message =
      language.getAccountAlreadyParticipatesInProjectErrorMessage(email);
    super(message);
    this.message = message;
  }
}
