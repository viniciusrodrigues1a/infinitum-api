import { Router } from "express";
import { ExpressControllerAdapter } from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";

export const accountsRoutes = Router();

accountsRoutes.get(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeFindOneAccountController(language)
  )
);
