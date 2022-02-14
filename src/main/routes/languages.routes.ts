import { ExpressControllerAdapter } from "@main/adapters";
import { knexControllerFactoryImpl } from "@main/factories/controllers";
import { Router } from "express";

export const languagesRoutes = Router();

languagesRoutes.get(
  "/",
  ExpressControllerAdapter(() =>
    knexControllerFactoryImpl.makeListLanguagesController()
  )
);
