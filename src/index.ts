import puppeteer from "puppeteer";
import url from "url";
import {unlink} from "fs-extra";
import {generateTemplate} from "./template";
import joi from "joi";
import {TerminalScreenshotOptions, terminalScreenshotOptionsSchema} from "./options";

export {TerminalScreenshotOptions} from "./options";

export async function renderScreenshot(options: Partial<TerminalScreenshotOptions>): Promise<Buffer> {
  const validatedOptions: TerminalScreenshotOptions = joi.attempt(options, terminalScreenshotOptionsSchema);

  const templatePath = await generateTemplate(validatedOptions);
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url.pathToFileURL(templatePath).toString());

    await page.waitForSelector(".xterm-screen");
    const {width, height} = await page.evaluate(async () => {
      const boundingRect = document.getElementsByClassName("xterm-screen").item(0)!.getBoundingClientRect();
      return {
        height: boundingRect.height,
        width: boundingRect.width,
      };
    });

    const buffer = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        height: height + validatedOptions.margin * 2,
        width: width + validatedOptions.margin * 2,
      },
      type: validatedOptions.type,
    });

    if (!Buffer.isBuffer(buffer)) {
      throw new Error("Expected a buffer out of puppeteer.");
    }

    return buffer;
  } finally {
    await Promise.all([
      // clean up
      unlink(templatePath),
      browser.close(),
    ]);
  }
}
