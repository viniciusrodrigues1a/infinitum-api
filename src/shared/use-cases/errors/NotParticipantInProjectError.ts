import { INotParticipantInProjectErrorLanguage } from "../interfaces/languages";

export class NotParticipantInProjectError extends Error {
  constructor(
    participantIdentifier: string,
    language: INotParticipantInProjectErrorLanguage
  ) {
    const message = language.getNotParticipantInProjectErrorMessage(
      participantIdentifier
    );
    super(message);
    this.message = message;
  }
}
