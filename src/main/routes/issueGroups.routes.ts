import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import { EmitProjectEventMiddleware } from "@main/middlewares/EmitProjectEventMiddleware";
import { AddProjectIdToRequestObjectMiddleware } from "@main/middlewares";

export const issueGroupsRoutes = Router();

const emitProjectEventMiddleware = new EmitProjectEventMiddleware();
const addProjectIdToRequestObjectMiddleware =
  new AddProjectIdToRequestObjectMiddleware();

/* AUTHORIZED ROUTES */

issueGroupsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

/* ROUTES THAT WILL EMIT A SOCKET EVENT */

issueGroupsRoutes.use(
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest
);

issueGroupsRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateIssueGroupForProjectController(language)
  )
);

issueGroupsRoutes.patch(
  "/:issueGroupId/final",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateIssueGroupFinalStatusController(
      language
    )
  )
);

issueGroupsRoutes.patch(
  "/color",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeUpdateIssueGroupColorController()
  )
);
