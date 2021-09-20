import { Router } from "express";
import { ExpressControllerAdapter } from "../adapters";
import { knexControllerFactoryImpl } from "../factories/controllers";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeRegisterController(language)
  )
);

authRoutes.post(
  "/login",
  ExpressControllerAdapter((language) =>
    knexControllerFactoryImpl.makeLoginController(language)
  )
);
