import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import { Router } from "express";

export const notificationSettingsRoutes = Router();

notificationSettingsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

notificationSettingsRoutes.put(
  "/",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeUpdateNotificationSettingsRepository()
  )
);
