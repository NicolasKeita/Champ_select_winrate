/** @type {import("ts-jest").JestConfigWithTsJest} */

const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

//preset: "ts-jest/presets/js-with-ts-esm",
module.exports = {
  preset: "ts-jest/presets/default",
  testEnvironment: "jsdom",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: [compilerOptions.baseUrl],
  moduleDirectories: ["node_modules"],
  roots: ["<rootDir>"],
  moduleFileExtensions: ["js", "jsx"]

};

// 	{
//   "^@public/(.*)$": "../<rootDir>/public/$1",
//   "^@utils/(.*)$": "../<rootDir>/utils/$1"
// }
