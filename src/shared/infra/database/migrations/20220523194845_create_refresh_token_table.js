exports.up = function (knex) {
  return knex.schema.createTable("refresh_token", (table) => {
    table.uuid("id").primary().notNullable();
    table
      .uuid("account_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("account")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.uuid("token").notNullable();
    table.timestamp("expires_at", { useTz: false }).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("refresh_token");
};
