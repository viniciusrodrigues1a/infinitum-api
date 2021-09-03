import { Router } from "express";
import { ExpressRouteAdapter } from "../adapters/ExpressRouteAdapter";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const accountRoutes = Router();

accountRoutes.post(
  "/register",
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeRegisterController(language)
  )
);

accountRoutes.post(
  "/login",
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeLoginController(language)
  )
);
