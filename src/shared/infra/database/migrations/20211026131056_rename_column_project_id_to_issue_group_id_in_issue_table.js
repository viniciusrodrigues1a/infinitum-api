exports.up = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.renameColumn("project_id", "issue_group_id");
  });
};

exports.down = function (knex) {
  return knex.schema.table("issue", (table) => {
    table.renameColumn("issue_group_id", "project_id");
  });
};
