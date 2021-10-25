exports.up = function (knex) {
  return knex.schema.createTable("issue_group", (table) => {
    table.uuid("id").primary().notNullable();
    table
      .uuid("project_id")
      .notNullable()
      .references("id")
      .inTable("project")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("title").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("issue_group");
};
