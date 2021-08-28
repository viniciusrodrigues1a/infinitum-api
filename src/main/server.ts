import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const port = 3333;
/* eslint-disable-next-line no-console  */
app.listen(port, () => console.log(`Server running on port ${port}`));
