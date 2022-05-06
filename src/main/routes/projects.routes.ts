import { Router } from "express";
import multer from "multer";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
  ExpressUploadFileBufferAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

export const projectsRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

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

projectsRoutes.get(
  "/invitedParticipants/:projectId",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeListParticipantsInvitedToProjectController(
      language
    )
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

projectsRoutes.patch(
  "/participantRole",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateParticipantRoleInProjectController(
      language
    )
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
