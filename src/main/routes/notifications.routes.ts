import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import {
  EmitNotificationEventMiddlewareFactory,
  knexMiddlewareFactoryImpl,
} from "@main/factories/middlewares";
import { Router } from "express";

export const notificationsRoutes = Router();

notificationsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);
notificationsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    new EmitNotificationEventMiddlewareFactory().make()
  )
);

notificationsRoutes.patch(
  "/:notificationId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeMarkNotificationAsReadController(language)
  )
);

notificationsRoutes.patch(
  "/",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeMarkAllNotificationsAsReadController()
  )
);
