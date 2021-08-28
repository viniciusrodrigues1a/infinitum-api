import dotenv from "dotenv";
import "@shared/infra/database/connection";
import express from "express";
import { accountRoutes } from "./routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/accounts", accountRoutes);

const port = 3333;
/* eslint-disable-next-line no-console  */
app.listen(port, () => console.log(`Server running on port ${port}`));
