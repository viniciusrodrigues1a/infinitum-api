const crypto = require("crypto");

exports.up = function (knex) {
  const languages = [
    {
      id: crypto.randomUUID(),
      iso_code: "pt-BR",
      display_name: "Português (Brasil)",
    },
    {
      id: crypto.randomUUID(),
      iso_code: "en-US",
      display_name: "English (United States)",
    },
    {
      id: crypto.randomUUID(),
      iso_code: "es-ES",
      display_name: "Español (España)",
    },
  ];
  return knex("language").insert(languages);
};

exports.down = function (knex) {
  const languageCodes = ["pt-BR", "en-US", "es-ES"];

  return knex("language").whereIn("iso_code", languageCodes).del();
};
