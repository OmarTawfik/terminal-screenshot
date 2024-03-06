import chalk from "chalk";
import {toMatchImageSnapshot} from "jest-image-snapshot";
import os from "os";
import path from "path";
import {renderScreenshot} from "../src/index";
import {TerminalScreenshotOptions} from "../src/options";

const colors = new chalk.Instance({
  // full color support
  level: 3,
});

beforeAll(() => {
  expect.extend({toMatchImageSnapshot});
});

defineTest("background-dark", {
  data: dark("this is a ", colors.bgHex("#0A0")(" green "), " background."),
});

defineTest("background-light", {
  data: light("this is a ", colors.bgHex("#0F0")(" green "), " background."),
});

defineTest("margin", {
  data: dark("margin around me!"),
  margin: 10,
  backgroundColor: "#FFF",
});

/*
 * Utils:
 */

function light(...parts: string[]): string {
  return colors.bgHex("#FFF").hex("#000")(parts.join(""));
}

function dark(...parts: string[]): string {
  return colors.bgHex("#000").hex("#FFF")(parts.join(""));
}

defineTest("colorScheme: dark", {
  data: colors.cyan("INFO:") + colors.gray(" using a light color scheme!"),
  colorScheme: path.resolve(__dirname, "./ayu.json"),
});

defineTest("colorScheme: light", {
  data: colors.cyan("INFO:") + colors.gray(" using a light color scheme!"),
  colorScheme: path.resolve(__dirname, "./tomorrow.json"),
});

it.concurrent("missing colorScheme file", async () => {
  await expect(
    renderScreenshot({
      data: "foo",
      colorScheme: path.resolve(__dirname, "./missing-colorScheme.json"),
    }),
  ).rejects.toThrow(/Failed to load colorScheme from/);
});

function defineTest(id: string, options: Partial<TerminalScreenshotOptions>): void {
  it.concurrent(id, async () => {
    const buffer = await renderScreenshot({
      fontFamily: "Courier",
      ...options,
    });

    expect(buffer).toMatchImageSnapshot({
      customSnapshotsDir: path.join(__dirname, "screenshots"),
      customSnapshotIdentifier: id,

      // Allow a margin of error, as this is just an e2e test to verify we load/render successfully.
      // But we should not fail for minor font differences between platforms:
      failureThreshold: 25,
      failureThresholdType: "percent",

      diffDirection: "vertical",
      customDiffDir: path.join(os.tmpdir(), "terminal-screenshot-tests"), // __SCREENSHOT_TEST_FAILURES_DIR__
    });
  });
}
