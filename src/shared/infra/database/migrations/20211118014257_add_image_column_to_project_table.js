exports.up = function (knex) {
  return knex.schema.table("project", (table) => {
    table.binary("image");
  });
};

exports.down = function (knex) {
  return knex.schema.table("project", (table) => {
    table.dropColumn("image");
  });
};
