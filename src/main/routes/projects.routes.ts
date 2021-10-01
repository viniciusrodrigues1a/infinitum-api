import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "../adapters";
import { knexMiddlewareFactoryImpl } from "../factories/middlewares/KnexMiddlewareFactoryImpl";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const projectsRoutes = Router();

projectsRoutes.use(
  ExpressMiddlewareAdapter((language) =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware(language as any)
  )
);

projectsRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateProjectController(language)
  )
);

projectsRoutes.delete(
  "/:projectId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeDeleteProjectController(language)
  )
);
