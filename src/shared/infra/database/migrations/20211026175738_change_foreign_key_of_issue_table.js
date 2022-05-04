// issue_group_id has been renamed but still references table "project",
// this migration drops that foreign key and creates a reference to
// the table "issue_group" as it should've always been the case

exports.up = function (knex) {
  return knex.schema.table("issue", (table) => {
    // project_id is not the name of the column anymore but knex will
    // turn this into "issue_project_id_foreign" which is the name
    // of the old FK referencing the table "project"
    table.dropForeign("project_id");
    table
      .foreign("issue_group_id")
      .references("id")
      .inTable("issue_group")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  // adding the FK again will result in an error
  // if there are rows in the issue table, since the column can't be null
  return new Promise((res) => res());
};
