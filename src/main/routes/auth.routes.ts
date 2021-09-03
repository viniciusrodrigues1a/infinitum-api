import { Router } from "express";
import { ExpressRouteAdapter } from "../adapters/ExpressRouteAdapter";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeRegisterController(language)
  )
);

authRoutes.post(
  "/login",
  ExpressRouteAdapter((language) =>
    knexControllerFactoryImpl.makeLoginController(language)
  )
);
