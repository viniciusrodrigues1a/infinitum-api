import { INotificationDoesntBelongToYouErrorLanguage } from "../interfaces/languages/INotificationDoesntBelongToYouErrorLanguage";

export class NotificationDoesntBelongToYouError extends Error {
  constructor(language: INotificationDoesntBelongToYouErrorLanguage) {
    const message = language.getNotificationDoesntBelongToYouErrorMessage();
    super(message);
    this.message = message;
  }
}
