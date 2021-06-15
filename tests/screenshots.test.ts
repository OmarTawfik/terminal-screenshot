import {renderScreenshot} from "../src/index";
import {TerminalScreenshotOptions} from "../src/options";
import path from "path";
import os from "os";
import chalk from "chalk";
import {toMatchImageSnapshot} from "jest-image-snapshot";

const colors = new chalk.Instance({
  // full color support
  level: 3,
});

beforeAll(() => {
  expect.extend({toMatchImageSnapshot});
});

defineTest("error-message", {
  data: colors.red("ERROR:") + colors.gray(" something went wrong!!!"),
});

defineTest("white-background", {
  data: colors.red("ERROR:") + colors.gray(" something went wrong!!!"),
  backgroundColor: "white",
});

defineTest("custom-background", {
  data: "this is a " + colors.bgCyan.black(" different ") + " background.",
});

defineTest("custom-margin", {
  data: chalk.bgHex("black")("margin around me!"),
  margin: 10,
  backgroundColor: "white",
});

defineTest("emojis", {
  data: [
    colors.blueBright(`Emojis:`),
    "",
    `* taking a screenshot 📸`,
    `* saving an image 💾`,
    `* running a test 🧪`,
    "",
    colors.greenBright("Test is complete."),
  ].join("\r\n"),
});

function defineTest(id: string, options: Partial<TerminalScreenshotOptions>): void {
  it.concurrent(`can render ${id}`, async () => {
    const buffer = await renderScreenshot(options as TerminalScreenshotOptions);

    expect(buffer).toMatchImageSnapshot({
      failureThreshold: 0,
      customSnapshotsDir: path.join(__dirname, "screenshots"),
      customSnapshotIdentifier: id,
      customDiffDir: os.tmpdir(),
    });
  });
}
