import joi from "joi";
import themes from "xterm-theme";

export interface TerminalScreenshotOptions {
  // Data to be render to the terminal.
  readonly data: string;
  // Margin to leave around the terminal area in pixels. (default: 0)
  readonly margin: number;
  // Font family to use in terminal output. (default: Monaco)
  readonly fontFamily: string;
  // Background color of the terminal. (default: black)
  readonly backgroundColor: string;
  // Type of the screenshot to be generated. (default: png)
  readonly type: "png" | "jpeg";
  // Name of the theme to use. (default: "")
  readonly colorScheme: string; // values https://github.com/ysk2014/xterm-theme/blob/master/src/index.js
}

export const terminalScreenshotOptionsSchema = joi.object({
  data: joi.string().required().min(1),
  margin: joi.number().min(1).max(10000).default(0),
  fontFamily: joi.string().min(1).default("Monaco"),
  backgroundColor: joi.string().min(1).default("black"),
  type: joi.string().valid("png", "jpeg").default("png"),
  colorScheme: joi
    .string()
    .valid(...Object.keys(themes))
    .min(1)
    .default(""),
});
