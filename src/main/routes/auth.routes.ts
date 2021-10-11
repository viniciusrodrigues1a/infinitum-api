import { Router } from "express";
import { ExpressControllerAdapter } from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";

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
