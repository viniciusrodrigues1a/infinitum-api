export interface IShouldAccountReceiveNotificationRepository {
  shouldAccountReceiveNotification(
    email: string,
    notificationKey: string,
    notificationMethod: string
  ): Promise<boolean>;
}
