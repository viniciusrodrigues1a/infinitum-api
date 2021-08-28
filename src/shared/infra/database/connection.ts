import knex from "knex";

import knexfile from "../../../../knexfile";

export const configuration =
  (process.env.NODE_ENV && (knexfile as any)[process.env.NODE_ENV]) ||
  knexfile.development;
export const connection = knex(configuration);
