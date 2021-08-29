/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
require("dotenv").config();

const databasePath = path.resolve(
  __dirname,
  "src",
  "shared",
  "infra",
  "database"
);

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    },
    migrations: {
      directory: path.resolve(databasePath, "migrations"),
    },
  },
  test: {
    client: "sqlite3",
    connection: ":memory:",
    migrations: {
      directory: path.resolve(databasePath, "migrations"),
    },
    useNullAsDefault: true,
  },
};
