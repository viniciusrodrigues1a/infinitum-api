exports.up = function (knex) {
  return knex.schema.createTable("project_role", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("project_role");
};
