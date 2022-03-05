import { loadNotifications } from "@main/socketEvents";
import { Request, Response, NextFunction } from "express";

export class EmitNotificationEventMiddleware {
  async handleRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const accountEmail = request.authorizedAccountEmail;

    if (!accountEmail) next();

    response.once("finish", () => {
      loadNotifications(accountEmail);
    });

    next();
  }
}
