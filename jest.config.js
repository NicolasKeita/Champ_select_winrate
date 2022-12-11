/** @type {import("ts-jest").JestConfigWithTsJest} */

const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  verbose: true,
  testEnvironment: "jsdom",
  modulePaths: [compilerOptions.baseUrl],
  transform: {
    ".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub"
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/Champ_select_winrate/" })
  },
  moduleDirectories: ["node_modules"],
  roots: ["<rootDir>/src/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"]

};