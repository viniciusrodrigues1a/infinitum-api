import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const invitationsRoutes = Router();

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
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeAcceptInvitationToProjectController(language)
  )
);

invitationsRoutes.post(
  "/kick",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeKickParticipantFromProjectController(language)
  )
);

invitationsRoutes.delete(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeRevokeInvitationController(language)
  )
);
