export interface INotificationService {
  notify(email: string, payload: any): Promise<void>;
}
