export interface IDoesNotificationBelongToAccountEmailRepository {
  doesNotificationBelongToAccountEmail(
    notificationId: string,
    email: string
  ): Promise<boolean>;
}
