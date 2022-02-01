exports.up = function (knex) {
  return knex.schema.table("project", (table) => {
    table.dropColumn("owner_id");
  });
};

exports.down = function (knex) {
  // adding the FK again will result in an error
  // if there are rows in the project table, since the column can't be null
  return new Promise((res) => res());
};
