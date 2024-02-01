import {renderScreenshot} from "../src";
import {TerminalScreenshotOptions} from "../src/options";
import themes from "xterm-theme";

defineTest("missing data", {}, `"data" is required`);

defineTest("minimum margin", {data: "test", margin: -5}, `"margin" must be greater than or equal to 1`);

defineTest("maximum margin", {data: "test", margin: 10000000}, `"margin" must be less than or equal to 10000`);

defineTest("invalid type", {data: "test", type: "foo"}, `"type" must be one of [png, jpeg]`);

const themesNames = Object.keys(themes).join(", ");
defineTest("invalid type", {data: "test", colorScheme: "bar"}, `"colorScheme" must be one of [${themesNames}]`);

function defineTest(id: string, object: unknown, error: string): void {
  it("validates " + id, async () => {
    await expect(() => renderScreenshot(object as TerminalScreenshotOptions)).rejects.toThrow(error);
  });
}
