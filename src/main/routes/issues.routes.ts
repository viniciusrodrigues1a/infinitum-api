import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import { EmitProjectEventMiddleware } from "@main/middlewares/EmitProjectEventMiddleware";
import { AddProjectIdToRequestObjectMiddleware } from "@main/middlewares";

export const issuesRoutes = Router();

const emitProjectEventMiddleware = new EmitProjectEventMiddleware();
const addProjectIdToRequestObjectMiddleware =
  new AddProjectIdToRequestObjectMiddleware();

/* AUTHORIZED ROUTES */

issuesRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

issuesRoutes.get(
  "/overview",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeOverviewMetricsController(language)
  )
);

/* ROUTES THAT WILL EMIT A SOCKET EVENT */

issuesRoutes.use(
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest
);

issuesRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateIssueController(language)
  )
);

issuesRoutes.delete(
  "/:issueId",
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest,
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeDeleteIssueController(language)
  )
);

issuesRoutes.put(
  "/:issueId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateIssueController(language)
  )
);

issuesRoutes.patch(
  "/:issueId/move",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeMoveIssueToAnotherIssueGroupController(
      language
    )
  )
);

issuesRoutes.patch(
  "/:issueId/assign",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeAssignIssueToAccountController(language)
  )
);
