import joi from "joi";

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
  // Path to a theme definition, https://xtermjs.org/docs/api/terminal/interfaces/itheme/,
  // check xterm-theme for examples https://github.com/ysk2014/xterm-theme/
  readonly colorScheme: string | URL;
}

export const terminalScreenshotOptionsSchema = joi.object({
  data: joi.string().required().min(1),
  margin: joi
    .number()
    .min(1)
    .max(10000)
    .default(0)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .messages({"any.only": "Margin to leave around the terminal area in pixels. (default: 0)"}),
  fontFamily: joi
    .string()
    .min(1)
    .default("Monaco")
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .messages({"any.only": "Font family to use in terminal output. (default: Monaco)"}),
  backgroundColor: joi
    .string()
    .min(1)
    .default("black")
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .messages({"any.only": "Background color of the terminal. (default: black)"}),
  type: joi.string().valid("png", "jpeg").default("png"),
  colorScheme: joi
    .string()
    .optional()
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .messages({"any.only": "Path to a theme definition, check type defintion or xterm-theme for examples"}),
});
