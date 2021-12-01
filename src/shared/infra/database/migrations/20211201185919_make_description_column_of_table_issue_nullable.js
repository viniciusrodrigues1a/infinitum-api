exports.up = function (knex) {
  return knex.schema.alterTable("issue", (table) => {
    table.string("description").nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("issue", (table) => {
    table.string("description").notNullable().alter();
  });
};
