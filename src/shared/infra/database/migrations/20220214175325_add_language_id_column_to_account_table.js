exports.up = function (knex) {
  return knex.schema.table("account", (table) => {
    table
      .uuid("language_id")
      .nullable()
      .references("id")
      .inTable("language")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.table("account", (table) => {
    table.dropForeign("language_id");
    table.dropColumn("language_id");
  });
};
