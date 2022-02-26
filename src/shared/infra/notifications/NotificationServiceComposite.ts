import { INotificationService } from "@shared/presentation/interfaces/notifications";

export class NotificationServiceComposite implements INotificationService {
  constructor(private readonly notificationsServices: INotificationService[]) {}

  async notify(email: string, payload: any): Promise<void> {
    for (let i = 0; i < this.notificationsServices.length; i++) {
      const notificationService = this.notificationsServices[i];
      notificationService.notify(email, payload);
    }
  }
}
