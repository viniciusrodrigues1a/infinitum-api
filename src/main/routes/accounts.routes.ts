import { Router } from "express";
import { ExpressRouteAdapter } from "../adapters/ExpressRouteAdapter";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const accountsRoutes = Router();

accountsRoutes.get(
  "/",
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeFindOneAccountController(language)
  )
);
