export interface IMarkAllAsReadNotificationRepository {
  markAllAsRead(email: string): Promise<void>;
}
