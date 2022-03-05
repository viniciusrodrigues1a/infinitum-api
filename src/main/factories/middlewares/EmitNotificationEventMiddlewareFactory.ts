import { EmitNotificationEventMiddleware } from "@main/middlewares";

export class EmitNotificationEventMiddlewareFactory {
  make(): EmitNotificationEventMiddleware {
    return new EmitNotificationEventMiddleware();
  }
}
