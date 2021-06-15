import type {Config} from "@jest/types";

export default (): Config.InitialOptions => ({
  verbose: true,
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "/out/"],
});
