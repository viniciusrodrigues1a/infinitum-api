import { INotificationNotFoundErrorLanguage } from "../interfaces/languages";

export class NotificationNotFoundError extends Error {
  constructor(language: INotificationNotFoundErrorLanguage) {
    const message = language.getNotificationNotFoundErrorMessage();
    super(message);
    this.message = message;
  }
}
