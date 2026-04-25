import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  maxWorkers: 1,
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { module: "commonjs" } }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
};

export default config;
