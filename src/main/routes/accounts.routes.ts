import { Router } from "express";
import multer from "multer";
import {
  ExpressControllerAdapter,
  ExpressMiddlewareAdapter,
  ExpressUploadFileBufferAdapter,
} from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { knexMiddlewareFactoryImpl } from "@main/factories/middlewares";

const upload = multer({ storage: multer.memoryStorage() });

export const accountsRoutes = Router();

accountsRoutes.get(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeFindOneAccountController(language)
  )
);

accountsRoutes.patch(
  "/",
  upload.single("file"),
  ExpressUploadFileBufferAdapter(),
  ExpressMiddlewareAdapter(() =>
    knexMiddlewareFactoryImpl.makeAuthorizationMiddleware()
  ),
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeUpdateAccountController(language)
  )
);
