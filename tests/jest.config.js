/* eslint-disable */
const { resolve } = require("path");
const { compilerOptions } = require("../tsconfig.json");
const rootDir = resolve(__dirname, "..");
const { pathsToModuleNameMapper } = require("ts-jest/utils");

module.exports = {
  rootDir,
  displayName: "integration-tests",
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
