/* eslint-disable */
const { resolve } = require("path");
const rootDir = resolve(__dirname, "..");

module.exports = {
  rootDir,
  displayName: "integration-tests",
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
};
