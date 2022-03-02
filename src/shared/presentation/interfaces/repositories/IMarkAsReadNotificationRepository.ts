export interface IMarkAsReadNotificationRepository {
  markAsRead(notificationId: string): Promise<void>;
}
