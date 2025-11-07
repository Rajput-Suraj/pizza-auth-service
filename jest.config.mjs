// jest.config.mjs
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["./src"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testRegex: "(\\.|/)(test|spec)\\.ts$",
};
