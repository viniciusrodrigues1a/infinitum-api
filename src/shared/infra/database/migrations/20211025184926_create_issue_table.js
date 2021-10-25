exports.up = function (knex) {
  return knex.schema.createTable("issue", (table) => {
    table.uuid("id").primary().notNullable();
    table
      .uuid("owner_id")
      .notNullable()
      .references("id")
      .inTable("account")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .uuid("project_id")
      .notNullable()
      .references("id")
      .inTable("project")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.timestamp("expires_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("issue");
};
