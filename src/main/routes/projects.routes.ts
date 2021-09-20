import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "../adapters";
import { knexMiddlewareFactoryImpl } from "../factories/middlewares/KnexMiddlewareFactoryImpl";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const projectsRoutes = Router();

projectsRoutes.post(
  "/",
  ExpressMiddlewareAdapter((language) =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware(language as any)
  ),
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateProjectController(language)
  )
);
