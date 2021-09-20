const crypto = require("crypto");

exports.up = function (knex) {
  return knex("project_role").insert([
    {
      id: crypto.randomUUID(),
      name: "espectator",
    },
    {
      id: crypto.randomUUID(),
      name: "member",
    },
    {
      id: crypto.randomUUID(),
      name: "admin",
    },
    {
      id: crypto.randomUUID(),
      name: "owner",
    },
  ]);
};

exports.down = function (knex) {
  return knex("project_role")
    .where({ name: "espectator" })
    .orWhere({ name: "member" })
    .orWhere({ name: "admin" })
    .orWhere({ name: "owner" })
    .del();
};
