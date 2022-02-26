import knex from "knex";

import knexfile from "../../../../knexfile";

const configuration =
  (process.env.NODE_ENV && (knexfile as any)[process.env.NODE_ENV]) ||
  knexfile.development;

if (process.env.DOCKER_RUNNING === "1") {
  configuration.connection.host = "postgreshost"; // docker-compose hostname
}

const connection = knex(configuration);

export { connection, configuration };
