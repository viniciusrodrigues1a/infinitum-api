exports.up = function (knex) {
  return knex.schema.alterTable("issue", (table) => {
    table.date("created_at").alter();
    table.date("expires_at").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("issue", (table) => {
    table.timestamp("created_at").alter();
    table.timestamp("expires_at").alter();
  });
};
