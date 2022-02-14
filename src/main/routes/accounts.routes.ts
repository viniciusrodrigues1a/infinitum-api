import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const accountsRoutes = Router();

accountsRoutes.get(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeFindOneAccountController(language)
  )
);

accountsRoutes.patch(
  "/",
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  ),
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateAccountController(language)
  )
);
