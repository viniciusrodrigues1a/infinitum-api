exports.up = function (knex) {
  return knex.schema.createTable("project", (table) => {
    table.uuid("id").primary().notNullable();
    table
      .uuid("owner_id")
      .notNullable()
      .references("id")
      .inTable("account")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("begins_at");
    table.timestamp("finishes_at");
    table.boolean("archived");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("project");
};
