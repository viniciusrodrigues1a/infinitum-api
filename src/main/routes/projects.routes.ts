import { Router } from "express";
import multer from "multer";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
  ExpressUploadFileBufferAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";
import {
  EmitProjectEventMiddleware,
  AddProjectIdToRequestObjectMiddleware,
} from "@main/middlewares";

export const projectsRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

const emitProjectEventMiddleware = new EmitProjectEventMiddleware();
const addProjectIdToRequestObjectMiddleware =
  new AddProjectIdToRequestObjectMiddleware();

/* AUTHORIZED ROUTES */

projectsRoutes.use(
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  )
);

projectsRoutes.get(
  "/invitedParticipants/:projectId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeListParticipantsInvitedToProjectController(
      language
    )
  )
);

projectsRoutes.get(
  "/",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeListProjectsOwnedByAccountController()
  )
);

projectsRoutes.patch(
  "/image",
  upload.single("file"),
  ExpressUploadFileBufferAdapter(),
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeUpdateProjectImageController()
  )
);

projectsRoutes.get(
  "/:projectId/image",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeFindProjectImageDataURLController()
  )
);

projectsRoutes.post(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeCreateProjectController(language)
  )
);

projectsRoutes.put(
  "/:projectId",
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest,
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateProjectController(language)
  )
);

projectsRoutes.delete(
  "/:projectId",
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest,
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeDeleteProjectController(language)
  )
);

projectsRoutes.patch(
  "/participantRole",
  addProjectIdToRequestObjectMiddleware.handleRequest,
  emitProjectEventMiddleware.handleRequest,
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateParticipantRoleInProjectController(
      language
    )
  )
);
