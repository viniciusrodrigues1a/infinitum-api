/* eslint-disable */
const { resolve } = require("path");
const rootDir = resolve(__dirname);

module.exports = {
  rootDir,
  displayName: "unit-tests",
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["<rootDir>/src/**/*.test.ts"],
};
