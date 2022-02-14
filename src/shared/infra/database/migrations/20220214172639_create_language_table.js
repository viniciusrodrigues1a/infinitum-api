exports.up = function (knex) {
  return knex.schema.createTable("language", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("iso_code").unique().notNullable();
    table.string("display_name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("language");
};
