exports.up = function (knex) {
  return knex.schema.table("account", (table) => {
    table.binary("image");
  });
};

exports.down = function (knex) {
  return knex.schema.table("account", (table) => {
    table.dropColumn("image");
  });
};
