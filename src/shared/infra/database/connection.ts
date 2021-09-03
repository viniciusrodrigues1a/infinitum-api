import knex from "knex";

import knexfile from "../../../../knexfile";

const configuration =
  (process.env.NODE_ENV && (knexfile as any)[process.env.NODE_ENV]) ||
  knexfile.development;

if (
  typeof configuration.connection === "object" &&
  "host" in configuration.connection
) {
  configuration.connection.host = "postgreshost"; // docker-compose hostname
}

const connection = knex(configuration);

export { connection, configuration };
