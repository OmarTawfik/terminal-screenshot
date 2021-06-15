#!/usr/bin/env node

import {Command} from "commander";
import {writeFile} from "fs-extra";
import {renderScreenshot} from "./index";

const options = new Command("terminal-screenshot")
  .description("Render terminal ANSI output into images!")
  .helpOption("-h, --help", "display usage help.")
  .option("-d, --data [string]", "Data to be render to the terminal.")
  .option("-m --margin [number]", "Margin to leave around the terminal area in pixels. (default: 0)")
  .option("-f --font-family [string]", "Font family to use in terminal output. (default: Monaco)")
  .option("-b --background-color [css-color]", "Background color of the terminal. (default: black)")
  .option("-t --type [png|jpeg]", "Type of the screenshot to be generated. (default: png)")
  .requiredOption("-o --output [path]", "Output path to save the screenshot to.")
  .exitOverride((error) => {
    if (error.code === "commander.helpDisplayed") {
      process.exit();
    }

    // Error details are already printed to user.
    process.exit(1);
  })
  .parse()
  .opts();

(async () => {
  try {
    const buffer = await renderScreenshot({
      data: options.data || (await getStdinData()),
      margin: options.margin ? parseInt(options.margin) : (undefined as any),
      fontFamily: options.fontFamily,
      backgroundColor: options.backgroundColor,
      type: options.type,
    });

    await writeFile(options.output, buffer);
  } catch (error) {
    console.error("Error: " + error.message);
    process.exit(1);
  }
})();

async function getStdinData(): Promise<string> {
  if (process.stdin.isTTY) {
    return "";
  }

  process.stdin.setEncoding("utf8");

  let result = "";
  for await (const chunk of process.stdin) {
    result += chunk;
  }

  return result.replace(/\r?\n/g, "\r\n");
}
