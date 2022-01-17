import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeRegisterController(language)
  )
);

authRoutes.post(
  "/login",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeLoginController(language)
  )
);

authRoutes.get(
  "/validate",
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  ),
  (_, res) => res.end()
);
