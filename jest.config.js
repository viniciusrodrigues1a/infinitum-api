/* eslint-disable */
const { resolve } = require("path");
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");
const rootDir = resolve(__dirname);

module.exports = {
  rootDir,
  displayName: "unit-tests",
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
