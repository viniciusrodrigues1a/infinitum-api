import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import {
  EmitProjectEventMiddleware,
  AddProjectIdToRequestObjectMiddleware,
} from "@main/middlewares";

export const invitationsRoutes = Router();

const emitProjectEventMiddleware = new EmitProjectEventMiddleware();
const addProjectIdToRequestObjectMiddleware =
  new AddProjectIdToRequestObjectMiddleware();

invitationsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

invitationsRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeInviteAccountToProjectUseCase(language)
  )
);

invitationsRoutes.post(
  "/accept/:invitationToken",
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest,
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeAcceptInvitationToProjectController(language)
  )
);

invitationsRoutes.post(
  "/revoke",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeRevokeInvitationController(language)
  )
);

invitationsRoutes.post(
  "/kick",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeKickParticipantFromProjectController(language)
  )
);
