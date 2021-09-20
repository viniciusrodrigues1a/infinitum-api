import { Router } from "express";
import { ExpressControllerAdapter } from "../adapters";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const accountsRoutes = Router();

accountsRoutes.get(
  "/",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeFindOneAccountController(language)
  )
);
