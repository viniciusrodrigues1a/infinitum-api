exports.up = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.boolean("completed").notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.dropColumn("completed");
  });
};
