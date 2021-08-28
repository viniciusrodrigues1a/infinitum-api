exports.up = function (knex) {
  return knex.schema.createTable("account", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password_hash").notNullable();
    table.string("salt").notNullable();
    table.integer("iterations").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("account");
};
