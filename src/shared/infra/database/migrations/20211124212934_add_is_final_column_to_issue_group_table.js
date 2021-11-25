exports.up = function (knex) {
  return knex.schema.table("issue_group", (table) => {
    table.boolean("is_final").notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("issue_group", (table) => {
    table.dropColumn("is_final");
  });
};
