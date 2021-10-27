import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const issuesRoutes = Router();

issuesRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

issuesRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateIssueController(language)
  )
);

issuesRoutes.delete(
  "/:issueId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeDeleteIssueController(language)
  )
);
