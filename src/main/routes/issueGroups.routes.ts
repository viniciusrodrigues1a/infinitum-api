import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const issueGroupsRoutes = Router();

issueGroupsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

issueGroupsRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateIssueGroupForProjectController(language)
  )
);

issueGroupsRoutes.patch(
  "/:issueGroupId/final",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeUpdateIssueGroupFinalStatusController()
  )
);

issueGroupsRoutes.patch(
  "/:issueGroupId/color",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeUpdateIssueGroupColorController()
  )
);
