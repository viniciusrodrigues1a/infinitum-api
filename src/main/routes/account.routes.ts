import { Router } from "express";
import { ExpressRouteAdapter } from "../adapters/ExpressRouteAdapter";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const accountRoutes = Router();

accountRoutes.post(
  "/",
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeRegisterController(language)
  )
);
