import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import { Router } from "express";

export const notificationsRoutes = Router();

notificationsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

notificationsRoutes.patch(
  "/:notificationId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeMarkNotificationAsReadController(language)
  )
);
