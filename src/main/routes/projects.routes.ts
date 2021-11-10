import { Router } from "express";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const projectsRoutes = Router();

projectsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
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

projectsRoutes.put(
  "/:projectId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateProjectController(language)
  )
);

projectsRoutes.get(
  "/",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeListProjectsOwnedByAccountController()
  )
);

projectsRoutes.post(
  "/invitation",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeInviteAccountToProjectUseCase(language)
  )
);

projectsRoutes.post(
  "/invitation/accept/:invitationToken",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeAcceptInvitationToProjectController(language)
  )
);
