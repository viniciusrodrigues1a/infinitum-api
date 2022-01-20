exports.up = function (knex) {
  return knex.schema.table("issue_group", (table) => {
    table.string("color", 6).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("issue_group", (table) => {
    table.dropColumn("color");
  });
};
