import { Router } from "express";
import { knexMiddlewareFactoryImpl } from "../factories/middlewares/KnexMiddlewareFactoryImpl";
import { ExpressMiddlewareAdapter } from "../adapters/ExpressMiddlewareAdapter";
import { ExpressRouteAdapter } from "../adapters/ExpressRouteAdapter";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const projectsRoutes = Router();

projectsRoutes.post(
  "/",
  ExpressMiddlewareAdapter((language) =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware(language as any)
  ),
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeCreateProjectController(language)
  )
);
