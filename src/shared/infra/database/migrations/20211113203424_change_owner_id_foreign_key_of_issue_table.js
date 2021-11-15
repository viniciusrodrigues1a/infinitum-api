exports.up = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.dropForeign("owner_id");
    table.dropColumn("owner_id");
    table
      .uuid("assigned_to_account_id")
      .nullable()
      .references("id")
      .inTable("account")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.dropForeign("assigned_to_account_id");
    table.dropColumn("assigned_to_account_id");
    table
      .uuid("owner_id")
      .references("id")
      .inTable("account")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};
