exports.up = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.bigInteger("order").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.dropColumn("order");
  });
};
