exports.up = function (knex) {
  return knex.schema.createTable("account_project_project_role", (table) => {
    table
      .uuid("account_id")
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
    table
      .uuid("project_role_id")
      .notNullable()
      .references("id")
      .inTable("project_role")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.primary(["account_id", "project_id", "project_role_id"]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("account_project_project_role");
};
