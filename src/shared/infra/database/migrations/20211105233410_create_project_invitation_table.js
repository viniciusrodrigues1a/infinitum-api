exports.up = function (knex) {
  return knex.schema.createTable("project_invitation", (table) => {
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
    table.string("token").primary().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("project_invitation");
};
